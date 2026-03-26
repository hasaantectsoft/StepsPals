//
//  StepPalsPhoneWidget.swift
//  StepPalsPhoneWidget
//
//  Created by Muhammad Asim Abbas on 14/10/2025.
//

import WidgetKit
import SwiftUI

// MARK: - Entry

struct PetEntry: TimelineEntry {
    let date: Date
    let appData: AppData?
}

// MARK: - Widget Provider

struct PhoneWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> PetEntry {
        NSLog("📱 StepPalsPhoneWidget: Placeholder requested")
        return PetEntry(date: Date(), appData: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (PetEntry) -> ()) {
        NSLog("📱 StepPalsPhoneWidget: getSnapshot called")
        let appData = AppData.load()
        NSLog("📱 StepPalsPhoneWidget: Loaded appData: \(appData != nil)")
        let entry = PetEntry(date: Date(), appData: appData)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PetEntry>) -> Void) {
        NSLog("📱 StepPalsPhoneWidget: getTimeline called")
        // Load current pet data
        let appData = AppData.load()
        NSLog("📱 StepPalsPhoneWidget: Loaded appData: \(appData != nil)")

        let currentDate = Date()
        let entry: PetEntry = PetEntry(date: currentDate, appData: appData)

        // Schedule the next update 5 minutes from now as a fallback.
        // The HealthKit observer with immediate frequency should trigger updates more frequently,
        // but this ensures the widget refreshes even if background updates fail.
        let refreshDate = Calendar.current.date(byAdding: .minute, value: 5, to: currentDate)!

        // Use .after policy to allow widget to refresh when HealthKit observer triggers reloadWidgets()
        // This policy allows the widget to update before the refresh date if reloadWidgets() is called
        let timeline = Timeline(entries: [entry], policy: .after(refreshDate))
        // let timeline = Timeline(entries: [entry], policy: .atEnd)
        NSLog("StepPalsPhoneWidget: getTimeline - Entry appData: \(entry.appData != nil ? "loaded" : "nil")")
        completion(timeline)
    }
}

struct StepPalsPhoneWidgetEntryView: View {
    var entry: PhoneWidgetProvider.Entry

    @Environment(\.widgetFamily) var widgetFamily
    
    init(entry: PhoneWidgetProvider.Entry) {
        self.entry = entry
        if let appData = entry.appData {
            NSLog("📱 StepPalsPhoneWidget: Rendering with appData - \(appData.petData.name), \(appData.stepData.currentSteps) steps")
        } else {
            NSLog("📱 StepPalsPhoneWidget: Rendering NoPetView - no app data")
        }
    }

    var body: some View {
        if let appData = entry.appData {
            switch widgetFamily {
            case .systemSmall:
                SmallWidgetView(appData: appData)
                    .customPadding()
            case .systemMedium:
                MediumWidgetView(appData: appData)
                    .customPadding()
            default:
                SmallWidgetView(appData: appData)
                    .customPadding()
            }
        } else {
            NoPetView()
                .customPadding()
        }
    }
}

// --- EXTENSION FOR CLEANER CODE ---
private extension View {
    func customPadding() -> some View {
        if #available(iOS 17.0, *) {
            return self
        } else {
            return self.padding(16)
        }
    }
}

@main
struct StepPalsPhoneWidget: Widget {
    let kind: String = "StepPalsPhoneWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PhoneWidgetProvider()) { entry in
            StepPalsPhoneWidgetEntryView(entry: entry)
                .modifier(ConditionalWidgetBackground())
        }
        .configurationDisplayName("StepPals")
        .description("Keep track of your pet's stats.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
