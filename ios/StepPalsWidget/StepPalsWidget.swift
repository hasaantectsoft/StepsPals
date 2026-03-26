//
//  StepPalsWidget.swift
//  StepPalsWidget
//

import SwiftUI
import WidgetKit

// MARK: - Entry

struct PetEntry: TimelineEntry {
    let date: Date
    let appData: AppData?
}

// MARK: - Widget Provider

struct StepPalsWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> PetEntry {
        PetEntry(date: Date(), appData: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (PetEntry) -> Void) {
        let appData = AppData.load()
        completion(PetEntry(date: Date(), appData: appData))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PetEntry>) -> Void) {
        let appData = AppData.load()
        let currentDate = Date()
        let entry = PetEntry(date: currentDate, appData: appData)
        let refreshDate = Calendar.current.date(byAdding: .minute, value: 5, to: currentDate)!
        let timeline = Timeline(entries: [entry], policy: .after(refreshDate))
        completion(timeline)
    }
}

struct StepPalsWidgetEntryView: View {
    var entry: StepPalsWidgetProvider.Entry

    @Environment(\.widgetFamily) var widgetFamily

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

private extension View {
    @ViewBuilder
    func customPadding() -> some View {
        if #available(iOS 17.0, *) {
            self
        } else {
            self.padding(16)
        }
    }
}

struct StepPalsWidget: Widget {
    let kind: String = "StepPalsWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StepPalsWidgetProvider()) { entry in
            StepPalsWidgetEntryView(entry: entry)
                .modifier(ConditionalWidgetBackground())
        }
        .configurationDisplayName("StepPals")
        .description("Keep track of your pet's stats.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
