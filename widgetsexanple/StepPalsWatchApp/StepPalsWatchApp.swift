//
//  StepPalsWatchApp.swift
//  StepPalsWatchApp
//
//  Created by Muhammad Asim Abbas on 23/10/2025.
//

import SwiftUI
import Foundation

struct AppView: View {
    let appData: AppData?

    @StateObject private var connectivityManager = WatchConnectivityManager.shared

    private var hasPet: Bool {
        // Check if we have real pet data (not just placeholder)
        // If appData exists in UserDefaults, we have a pet
        if appData != nil {
            return true
        }
        return false
    }

    var body: some View {
        Group {
            if let appData = appData {
                VStack {
                    VStack(spacing: 8) {
                        Text("\(appData.petData.name)")
                            .foregroundStyle(.white)
                            .font(.custom("PressStart2P-Regular", size: 10))
                            .lineLimit(1)

                        VStack(spacing: 2) {
                            HStack {
                                HStack(spacing: 5) {
                                    Image("paw_pink")
                                        .resizable()
                                        .scaledToFit()
                                        .frame(height: 10)

                                    Text("\(appData.stepData.currentSteps)")
                                        .foregroundStyle(
                                            Color(
                                                #colorLiteral(
                                                    red: 0.941603303,
                                                    green: 0.3168764114,
                                                    blue: 0.4697675705,
                                                    alpha: 1
                                                )
                                            )
                                        )
                                        .font(.custom("PressStart2P-Regular", size: 8))
                                        .fontWeight(.semibold)
                                        .minimumScaleFactor(0.8)
                                        .lineLimit(1)
                                }

                                Spacer()

                                Text("\(Int(appData.stepData.progressPercentage))%")
                                    .foregroundStyle(
                                        Color(
                                            #colorLiteral(
                                                red: 0.4226126075,
                                                green: 0.7922848463,
                                                blue: 1,
                                                alpha: 1
                                            )
                                        )
                                    )
                                    .font(.custom("PressStart2P-Regular", size: 8))
                                    .fontWeight(.semibold)
                                    .minimumScaleFactor(0.8)
                                    .lineLimit(1)
                            }

                            HStack(alignment: .top) {
                                ZStack(alignment: .topLeading) {
                                    VStack(spacing: 0) {
                                        StepProgressView(
                                            current: appData.stepData.currentSteps,
                                            total: appData.stepData.stepsGoal
                                        )
                                        .padding(.top, 9)
                                        .padding(.trailing, 20)

                                        GeometryReader { geometry in
                                            ZStack(alignment: .leading) {
                                                Image(
                                                    CareData.getImageName(
                                                        for: CareType.feed,
                                                        status: appData.careData.feed
                                                    )
                                                )
                                                .resizable()
                                                .modifier(WidgetTintPropertiesModifier())
                                                .scaledToFit()
                                                .frame(width: 20)
                                                .padding(.leading, -2 + (geometry.size.width * 0.25))

                                                Image(
                                                    CareData.getImageName(
                                                        for: CareType.giveWater,
                                                        status: appData.careData.giveWater
                                                    )
                                                )
                                                .resizable()
                                                .modifier(WidgetTintPropertiesModifier())
                                                .scaledToFit()
                                                .frame(width: 20)
                                                .padding(.leading, -2 + (geometry.size.width * 0.50) - 5)

                                                Image(
                                                    CareData.getImageName(
                                                        for: CareType.cleanPoop,
                                                        status: appData.careData.cleanPoop
                                                    )
                                                )
                                                .resizable()
                                                .modifier(WidgetTintPropertiesModifier())
                                                .scaledToFit()
                                                .frame(width: 20)
                                                .padding(.leading, -2 + (geometry.size.width * 0.75) - 10)
                                            }
                                        }
                                        .padding(.trailing, 20)
                                        .frame(height: 24)
                                    }

                                    HStack(alignment: .top) {
                                        Spacer()
                                        TreatImageView(
                                            careData: appData.careData,
                                            stepsPercentage: appData.stepData.progressPercentage,
                                            height: 30
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Spacer()

                    PetImageView(
                        species: appData.petData.species,
                        maturity: appData.petData.maturity,
                        condition: appData.petData.condition,
                        height: 60
                    )
                }
                .frame(maxHeight: .infinity, alignment: .top)
                .padding(.horizontal)
            } else {
                NoPetView()
            }
        }
        .onAppear {
            // Request data update when view appears
            connectivityManager.requestDataUpdate()
        }
        .onChange(of: connectivityManager.appData?.lastUpdated) { _ in
            // React to changes in connectivity manager data
        }
    }
}

// MARK: - No Pet View

struct NoPetView: View {
    var body: some View {
        VStack(spacing: 30) {
            Spacer()

            Image("steppals_logo")
                .resizable()
                .scaledToFit()
                .frame(height: 40)

            VStack(spacing: 20) {
                Text("No Pet Yet")
                    .foregroundStyle(
                        Color(
                            #colorLiteral(
                                red: 0.941603303, green: 0.3168764114, blue: 0.4697675705, alpha: 1)
                        )
                    )
                    .font(.custom("PressStart2P-Regular", size: 14))

                Text("Open StepPals\nto adopt a pet!")
                    .foregroundStyle(
                        Color(
                            #colorLiteral(red: 0.4226126075, green: 0.7922848463, blue: 1, alpha: 1)
                        )
                    )
                    .font(.custom("PressStart2P-Regular", size: 10))
                    .fixedSize(horizontal: false, vertical: true)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }

            Spacer()
        }
        .padding()
    }
}

@main
struct StepPalsWatchApp: App {
    @StateObject private var connectivityManager = WatchConnectivityManager.shared

    init() {
        // Initialize WatchConnectivity when app launches
        _ = WatchConnectivityManager.shared
    }

    var body: some Scene {
        WindowGroup {
            AppView(appData: connectivityManager.appData)
        }
    }
}

#if DEBUG

    // MARK: - Watch App All Species / Maturity / Condition Preview

    private let previewSpecies: [Species] = [
        .Cat,
//        .Dog,
//        .Dino
    ]
    private let previewMaturities: [Maturity] = [
        .Baby,
        .Teen,
        .Adult
    ]  // Exclude .Egg
    private let previewConditions: [Condition] = [
        .Healthy,
//        .Sick,
//        .VerySick,
//        .Dead
    ]

//    // Optionally, you can define pet names for each species
//    private func petName(for species: Species) -> String {
//        switch species {
//            case .Cat: return "Billi"
//            case .Dog: return "Max"
//            case .Dino: return "Dino"
//        }
//    }
//
//    // Some test data for each preview, can expand if needed
//    private func stepData(for condition: Condition, maturity: Maturity) -> StepData {
//        switch condition {
//        case .Healthy:
//            switch maturity {
//                case .Baby: return StepData(currentSteps: 10000, stepsGoal: 20000)
//                case .Teen: return StepData(currentSteps: 5000, stepsGoal: 20000)
//                case .Adult: return StepData(currentSteps: 5000, stepsGoal: 20000)
//                case .Egg: return StepData(currentSteps: 5000, stepsGoal: 20000)
//            }
//        case .Sick:
//            switch maturity {
//                case .Baby: return StepData(currentSteps: 10000, stepsGoal: 20000)
//                case .Teen: return StepData(currentSteps: 10000, stepsGoal: 20000)
//                case .Adult: return StepData(currentSteps: 10000, stepsGoal: 20000)
//                case .Egg: return StepData(currentSteps: 10000, stepsGoal: 20000)
//            }
//        case .VerySick:
//            switch maturity {
//                case .Baby: return StepData(currentSteps: 15000, stepsGoal: 20000)
//                case .Teen: return StepData(currentSteps: 15000, stepsGoal: 20000)
//                case .Adult: return StepData(currentSteps: 15000, stepsGoal: 20000)
//                case .Egg: return StepData(currentSteps: 15000, stepsGoal: 20000)
//            }
//        case .Dead:
//            switch maturity {
//                case .Baby: return StepData(currentSteps: 19000, stepsGoal: 20000)
//                case .Teen: return StepData(currentSteps: 19000, stepsGoal: 20000)
//                case .Adult: return StepData(currentSteps: 19000, stepsGoal: 20000)
//                case .Egg: return StepData(currentSteps: 19000, stepsGoal: 20000)
//            }
//        }
//    }
//
//    private func careData(for condition: Condition) -> CareData {
//        switch condition {
//        case .Healthy:
//            return CareData(
//                feed: .disabled,
//                giveWater: .disabled,
//                cleanPoop: .disabled,
//                giveTreat: .disabled
//            )
//        case .Sick:
//            return CareData(
//                feed: .pending,
//                giveWater: .disabled,
//                cleanPoop: .disabled,
//                giveTreat: .disabled
//            )
//        case .VerySick:
//            return CareData(
//                feed: .completed,
//                giveWater: .pending,
//                cleanPoop: .disabled,
//                giveTreat: .disabled
//            )
//        case .Dead:
//            return CareData(
//                feed: .completed,
//                giveWater: .completed,
//                cleanPoop: .pending,
//                giveTreat: .disabled
//            )
//        }
//    }
//
//    struct StepPalsWatchAllCombinationsPreview: PreviewProvider {
//        static var previews: some View {
//            Group {
//                // Add the NoPetView as well
//                NoPetView()
//                    .previewDisplayName("No Pet View")
//
//                ForEach(previewSpecies, id: \.self) { species in
//                    ForEach(previewMaturities, id: \.self) { maturity in
//                        ForEach(previewConditions, id: \.self) { condition in
//                            let name = petName(for: species)
//                            let step = stepData(for: condition, maturity: maturity)
//                            let care = careData(for: condition)
//                            AppView(
//                                appData: AppData(
//                                    petData: PetData(
//                                        name: name,
//                                        species: species,
//                                        maturity: maturity,
//                                        condition: condition
//                                    ),
//                                    stepData: step,
//                                    careData: care,
//                                    lastUpdated: AppData.dateFormatter.string(from: Date())
//                                )
//                            )
//                            .previewDisplayName(
//                                "\(species.displayName) \(maturity.displayName) \(condition.displayName)"
//                            )
//                        }
//                    }
//                }
//            }
//        }
//    }

    struct TempPreview: PreviewProvider {
        static var previews: some View {
            AppView(
                appData: AppData(
                    petData: PetData(
                        name: "Billi",
                        species: Species.Cat,
                        maturity: Maturity.Adult,
                        condition: Condition.Healthy
                    ),
                    stepData: StepData(
                        currentSteps: 17000,
                        stepsGoal: 20000
                    ),
                    careData: CareData(
                        feed: CareStatus.disabled,
                        giveWater: CareStatus.disabled,
                        cleanPoop: CareStatus.disabled,
                        giveTreat: CareStatus.disabled
                    ),
                    lastUpdated: AppData.dateFormatter.string(from: Date())
                )
            )
            .previewDisplayName(
                "Cat Baby Healthy"
            )
        }
    }

    // Convenient display names for preview labels
//    private extension Species {
//        var displayName: String {
//            switch self {
//                case .Cat: return "Cat"
//                case .Dog: return "Dog"
//                case .Dino: return "Dino"
//            }
//        }
//    }
//    private extension Maturity {
//        var displayName: String {
//            switch self {
//                case .Baby: return "Baby"
//                case .Teen: return "Teen"
//                case .Adult: return "Adult"
//                case .Egg: return "Egg"
//            }
//        }
//    }
//    private extension Condition {
//        var displayName: String {
//            switch self {
//                case .Healthy: return "Healthy"
//                case .Sick: return "Sick"
//                case .VerySick: return "Very Sick"
//                case .Dead: return "Dead"
//            }
//        }
//    }
#endif
