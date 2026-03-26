//
//  StepPalsWatchWidget.swift
//  StepPalsWatchWidget
//
//  Created by Muhammad Asim Abbas on 21/10/2025.
//

import Foundation
import SwiftUI
import WidgetKit

// MARK: - Entry

struct WatchPetEntry: TimelineEntry {
    let date: Date
    let appData: AppData?
}

// MARK: - Widget Provider

struct WatchWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> WatchPetEntry {
        NSLog("📱 StepPalsWatchWidget: Placeholder requested")
        return WatchPetEntry(date: Date(), appData: nil)
    }
    
    func getSnapshot(in context: Context, completion: @escaping (WatchPetEntry) -> ()) {
        NSLog("📱 StepPalsWatchWidget: getSnapshot called")
        let appData = AppData.load()
        NSLog("📱 StepPalsWatchWidget: Loaded appData: \(appData != nil)")
        let entry = WatchPetEntry(date: Date(), appData: appData)
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<WatchPetEntry>) -> Void) {
        NSLog("📱 StepPalsWatchWidget: getTimeline called")
        // Load current pet data
        let appData = AppData.load()
        NSLog("📱 StepPalsWatchWidget: Loaded appData: \(appData != nil)")

        let currentDate = Date()
        let entry: WatchPetEntry = WatchPetEntry(date: currentDate, appData: appData)

        // Schedule the next update 5 minutes from now as a fallback.
        // The HealthKit observer with immediate frequency should trigger updates more frequently,
        // but this ensures the widget refreshes even if background updates fail.
        let refreshDate = Calendar.current.date(byAdding: .minute, value: 5, to: currentDate)!

        // Use .after policy to allow widget to refresh when HealthKit observer triggers reloadWidgets()
        // This policy allows the widget to update before the refresh date if reloadWidgets() is called
        let timeline = Timeline(entries: [entry], policy: .after(refreshDate))
        // let timeline = Timeline(entries: [entry], policy: .atEnd)
        NSLog("StepPalsWatchWidget: getTimeline - Entry appData: \(entry.appData != nil ? "loaded" : "nil")")
        completion(timeline)
    }
}


// MARK: - Rectangular Widget (Complication)
struct RectangularWidgetView: View {
    let appData: AppData?
    @Environment(\.widgetRenderingMode) var renderingMode

    var body: some View {
        if let appData = appData {
            var conditionText: String {
                switch appData.petData.condition {
                case Condition.Healthy: return "Healthy"
                case Condition.Sick: return "Sick"
                case Condition.VerySick: return "V. Sick"
                case Condition.Dead: return "Dead"
                }
            }
            VStack(alignment: .leading, spacing: 3) {
                HStack(spacing: 4) {
                    VStack(spacing: 4) {
                        HStack {
                            Text("\(appData.petData.name)")
                            // Text(conditionText)
                                .font(
                                    .custom(
                                        "PressStart2P-Regular",
                                        size: 10,
                                        relativeTo: .title
                                    )
                                )
                                .foregroundStyle(.white)
                                .minimumScaleFactor(0.7)
                                .lineLimit(1)
                                .widgetAccentable()
                            Spacer()
                        }

                        HStack(spacing: 4) {
                            Image("paw_pink")
                                .resizable()
                                .modifier(WidgetTintPropertiesModifier())
                                .scaledToFit()
                                .frame(height: 10)

                            Text("\(appData.stepData.currentSteps)")
                                .font(
                                    .custom(
                                        "PressStart2P-Regular",
                                        size: 8,
                                        relativeTo: .title2
                                    )
                                )
                                .foregroundStyle(.white)
                            Spacer()
                        }

                        VStack(spacing: 4) {
                            HStack {
                                Text(
                                    "\(Int(appData.stepData.progressPercentage))%"
                                )
                                .font(
                                    .custom(
                                        "PressStart2P-Regular",
                                        size: 6,
                                        relativeTo: .title3
                                    )
                                )
                                .foregroundStyle(.white)
                                Spacer()
                            }

                            HStack {
                                ZStack(alignment: .leading) {
                                    StepProgressView(
                                        current: appData.stepData.currentSteps,
                                        total: appData.stepData.stepsGoal
                                    )
                                    .padding(.top, 0)
                                    .padding(.trailing, 7)

                                    HStack {
                                        Spacer()
                                        TreatImageView(
                                            careData: appData.careData,
                                            stepsPercentage: appData.stepData.progressPercentage,
                                            height: 20
                                        )
                                    }
                                }
                            }
                        }
                    }

                    PetImageView(
                        species: appData.petData.species,
                        maturity: appData.petData.maturity,
                        condition: appData.petData.condition,
                        height: 55
                    )
                }
            }
        } else {
            VStack(spacing: 6) {
                Image("steppals_logo")
                    .resizable()
                    .modifier(WidgetTintPropertiesModifier())
                    .scaledToFit()
                    .frame(height: 18)

                Text("Open StepPals\nto adopt a pet!")
                    .foregroundStyle(Color(
                                #colorLiteral(
                                    red: 0.4226126075,
                                    green: 0.7922848463,
                                    blue: 1,
                                    alpha: 1
                                )
                        )
                    )
                    .font(.custom("PressStart2P-Regular", size: 8))
                    .fixedSize(horizontal: false, vertical: true)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .widgetAccentable()
            }
        }
    }
}

// MARK: - Circular Widget (Complication)
struct CircularWidgetView: View {
    let appData: AppData?
    @Environment(\.widgetRenderingMode) var renderingMode

    var body: some View {
        if let appData = appData {
            VStack {
                ZStack {
                    Circle()
                        .stroke(lineWidth: 4)
                        .opacity(0.2)
                        .foregroundStyle(
                            Color(
                                #colorLiteral(
                                    red: 0.6227959394,
                                    green: 0.6924163699,
                                    blue: 0.6869036555,
                                    alpha: 1
                                )
                            )
                        )
                        .frame(width: 40, height: 40)

                    Circle()
                        .trim(
                            from: 0.0,
                            to: CGFloat(
                                Double(appData.stepData.progressPercentage)
                                    / 100.0
                            )
                        )
                        .stroke(
                            style: StrokeStyle(lineWidth: 4, lineCap: .round)
                        )
                        .foregroundStyle(
                            Color(
                                #colorLiteral(
                                    red: 0.4283347726,
                                    green: 0.7923064828,
                                    blue: 1,
                                    alpha: 1
                                )
                            )
                        )
                        .rotationEffect(Angle(degrees: 270))
                        .frame(width: 40, height: 40)
                        .widgetAccentable()

                    VStack(spacing: 4) {
                        if appData.careData.giveTreat == .pending {
                            TreatImageView(
                                careData: appData.careData,
                                stepsPercentage: appData.stepData.progressPercentage,
                                height: 24
                            )
                        } else if appData.careData.cleanPoop == .pending {
                            Image("poop")
                                .resizable()
                                .modifier(WidgetTintPropertiesModifier())
                                .scaledToFit()
                                .frame(height: 20)
                        } else if appData.careData.giveWater == .pending {
                            Image("bottle")
                                .resizable()
                                .modifier(WidgetTintPropertiesModifier())
                                .scaledToFit()
                                .frame(height: 20)
                        } else if appData.careData.feed == .pending {
                            Image("bowl")
                                .resizable()
                                .modifier(WidgetTintPropertiesModifier())
                                .scaledToFit()
                                .frame(height: 20)
                        } else {
                            Image("paw_pink")
                                .resizable()
                                .modifier(WidgetTintPropertiesModifier())
                                .scaledToFit()
                                .frame(width: 14)

                            Text("\(Int(appData.stepData.progressPercentage))%")
                                .foregroundStyle(.white)
                                .font(.custom("PressStart2P-Regular", size: 5))
                                .minimumScaleFactor(0.5)
                                .lineLimit(1)
                                .widgetAccentable()
                        }
                    }
                }
                .padding(5)
            }
            .cornerRadius(50)
        } else {
            VStack(spacing: 6) {
                Image("paw_pink")
                    .resizable()
                    .modifier(WidgetTintPropertiesModifier())
                    .scaledToFit()
                    .frame(height: 12)

                Text("No pet")
                    .font(.custom("PressStart2P-Regular", size: 6))
                    .foregroundStyle(Color(
                        #colorLiteral(
                            red: 0.4226126075,
                            green: 0.7922848463,
                            blue: 1,
                            alpha: 1
                        )
                    ))
                    .fixedSize(horizontal: false, vertical: true)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .widgetAccentable()
            }
            .padding(8)
        }
    }
}

struct WidgetBackgroundModifier: ViewModifier {
    func body(content: Content) -> some View {
        if #available(watchOS 10.0, *) {
            content.containerBackground(for: .widget) {
                Color.clear
            }
        } else {
            content.background(Color.clear)
        }
    }
}

// MARK: - Main Entry View

struct StepPalsWatchWidgetEntryView: View {
    var entry: WatchWidgetProvider.Entry
    @Environment(\.widgetFamily) var widgetFamily

    var body: some View {
        switch widgetFamily {
        case .accessoryCircular:
            CircularWidgetView(appData: entry.appData)
                .modifier(WidgetBackgroundModifier())
        case .accessoryRectangular:
            RectangularWidgetView(appData: entry.appData)
                .modifier(WidgetBackgroundModifier())
        default:
            VStack {
                Text("?")
            }
        }
    }
}

// MARK: - Widget Configuration

struct StepPalsWatchWidget: Widget {
    let kind: String = "StepPalsWatchWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WatchWidgetProvider()) {
            entry in
            StepPalsWatchWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("StepPals")
        .description("Keep track of your pet's stats.")
        #if os(watchOS)
            .supportedFamilies([
                .accessoryCircular,
                .accessoryRectangular,
            ])
        #endif
    }
}

@main
struct StepPalsWatchWidgetBundle: WidgetBundle {
    @WidgetBundleBuilder
    var body: some Widget {
        StepPalsWatchWidget()
    }
}

#if DEBUG

    // MARK: - Utils

    private let allSpecies: [Species] = [
//        .Cat,
//        .Dog,
        .Dino,
    ]
    private let allMaturities: [Maturity] = [
        .Baby,
        .Teen,
        .Adult
    ]
    private let allConditions: [Condition] = [
        .Healthy,
//        .Sick,
//        .VerySick,
//        .Dead,
    ]

    // Provide a name for each species for preview
    private func name(for species: Species) -> String {
        switch species {
        case .Cat: return "Billi"
        case .Dog: return "Pupper"
        case .Dino: return "Dino"
        }
    }

    // Provide step & goal defaults per species for various condition "types"
    private func stepsFor(species: Species, condition: Condition) -> (
        current: Int, goal: Int
    ) {
        // Tweak as needed to match typical app test data
        switch species {
        case .Cat:
            switch condition {
            case .Healthy: return (17000, 20000)
            case .Sick: return (11000, 20000)
            case .VerySick: return (7000, 20000)
            case .Dead: return (2000, 20000)
            }
        case .Dog:
            switch condition {
            case .Healthy: return (11000, 20000)
            case .Sick: return (7000, 20000)
            case .VerySick: return (2500, 20000)
            case .Dead: return (1200, 20000)
            }
        case .Dino:
            switch condition {
            case .Healthy: return (20000, 20000)
            case .Sick: return (10000, 20000)
            case .VerySick: return (3500, 20000)
            case .Dead: return (8000, 20000)
            }
        }
    }

    private func careDataFor(species: Species, condition: Condition) -> CareData
    {
        switch species {
        case .Cat:
            return CareData(
                feed: .pending,
                giveWater: .pending,
                cleanPoop: .pending,
                giveTreat: .disabled
            )
        case .Dog:
            return CareData(
                feed: .completed,
                giveWater: .completed,
                cleanPoop: .pending,
                giveTreat: .pending
            )
        case .Dino:
            return CareData(
                feed: .completed,
                giveWater: .completed,
                cleanPoop: .pending,
                giveTreat: .pending
            )
        }
    }

    // MARK: - Generic Preview Generator

    private func previewEntry(
        species: Species,
        maturity: Maturity,
        condition: Condition
    ) -> WatchPetEntry {
        let (currentSteps, stepsGoal) = stepsFor(
            species: species,
            condition: condition
        )
        let pet = PetData(
            name: name(for: species),
            species: species,
            maturity: maturity,
            condition: condition
        )
        let stepData = StepData(
            currentSteps: currentSteps,
            stepsGoal: stepsGoal
        )
        let careData = careDataFor(species: species, condition: condition)
        let appData = AppData(
            petData: pet,
            stepData: stepData,
            careData: careData,
            lastUpdated: AppData.dateFormatter.string(from: Date())
        )
        return WatchPetEntry(
            date: Date(),
            appData: appData
        )
    }

    // MARK: - Rectangular Previews

    struct RectangularEmpty: PreviewProvider {
        @Environment(\.widgetRenderingMode) var renderingMode

        static var previews: some View {
            StepPalsWatchWidgetEntryView(
                entry: WatchPetEntry(
                    date: Date(),
                    appData: nil
                )
            )
            #if os(watchOS)
                .previewContext(
                    WidgetPreviewContext(family: .accessoryRectangular)
                )
            #endif
        }
    }

    struct RectangularAllCombinations: PreviewProvider {
        static var previews: some View {
            Group {
                ForEach(allSpecies, id: \.self) { species in
                    ForEach(allMaturities, id: \.self) { maturity in
                        ForEach(allConditions, id: \.self) { condition in
                            StepPalsWatchWidgetEntryView(
                                entry: previewEntry(
                                    species: species,
                                    maturity: maturity,
                                    condition: condition
                                )
                            )
                            .previewDisplayName(
                                "\(species) (\(maturity) - \(condition))"
                            )
                            #if os(watchOS)
                                .previewContext(
                                    WidgetPreviewContext(
                                        family: .accessoryRectangular
                                    )
                                )
                            #endif
                        }
                    }
                }
            }
        }
    }

    // MARK: - Circular Previews

    struct CircularEmpty: PreviewProvider {
        static var previews: some View {
            StepPalsWatchWidgetEntryView(
                entry: WatchPetEntry(
                    date: Date(),
                    appData: nil
                )
            )
            #if os(watchOS)
                .previewContext(
                    WidgetPreviewContext(family: .accessoryCircular)
                )
            #endif
        }
    }

    struct CircularAllCombinations: PreviewProvider {
        static var previews: some View {
            StepPalsWatchWidgetEntryView(
                entry: previewEntry(
                    species: Species.Cat,
                    maturity: Maturity.Baby,
                    condition: Condition.Healthy
                )
            )
            .previewDisplayName("Circular Populated")
            #if os(watchOS)
                .previewContext(
                    WidgetPreviewContext(
                        family: .accessoryCircular
                    )
                )
            #endif
        }
    }

#endif
