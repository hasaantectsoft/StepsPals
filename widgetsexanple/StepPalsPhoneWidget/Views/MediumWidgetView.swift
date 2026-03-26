//
//  MediumWidgetView.swift
//  StepPalsPhoneWidget
//
//  Created by Muhammad Asim Abbas on 23/10/2025.
//

import SwiftUI
import WidgetKit

struct MediumWidgetView: View {
    let appData: AppData
    var conditionText: String {
        switch appData.petData.condition {
        case Condition.Healthy: return "Healthy"
        case Condition.Sick: return "Sick"
        case Condition.VerySick: return "Very Sick"
        case Condition.Dead: return "Dead"
        }
    }

    var body: some View {
        VStack {
            HStack(spacing: 10) {
                PetImageView(
                    species: appData.petData.species,
                    maturity: appData.petData.maturity,
                    condition: appData.petData.condition,
                    height: 100
                )

                Spacer()

                VStack(spacing: 5) {
                    Spacer()

                    HStack(spacing: 5) {
                        HStack(spacing: 5) {
                            Image("paw_pink")
                                .resizable()
                                .modifier(WidgetTintPropertiesModifier())
                                .scaledToFit()
                                .frame(height: 14)

                            Text("\(appData.stepData.currentSteps)")
                                .foregroundStyle(
                                    Color(
                                        #colorLiteral(
                                            red: 0.941603303, green: 0.3168764114,
                                            blue: 0.4697675705, alpha: 1))
                                )
                                .font(.custom("PressStart2P-Regular", size: 13))
                                .fontWeight(.semibold)
                                .minimumScaleFactor(0.8)
                                .lineLimit(1)
                        }

                        Spacer()

                        Text("\(Int(appData.stepData.progressPercentage))%")
                            .foregroundStyle(.black)
                            .font(.custom("PressStart2P-Regular", size: 11))
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
                                .padding(.top, 12)
                                .padding(.trailing, 23)

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
                                .padding(.trailing, 23)
                                .frame(height: 24)
                            }

                            HStack(alignment: .top) {
                                Spacer()
                                TreatImageView(
                                    careData: appData.careData,
                                    stepsPercentage: appData.stepData.progressPercentage,
                                    height: 34
                                )
                            }
                        }
                    }
                    
                    Spacer()
//                    Text("\(appData.lastUpdated)")
//                        .foregroundStyle(.black)
//                        .font(.caption2)
//                        .widgetAccentable()
                    
                    Text("\(appData.petData.name) is \(conditionText)")
                        .font(.custom("PressStart2P-Regular", size: 12))
                        .fontWeight(.semibold)
                        .foregroundStyle(.black)
                        .fixedSize(horizontal: false, vertical: true)
                        .multilineTextAlignment(.center)
                        .lineSpacing(3)
                        .widgetAccentable()

                    Spacer()
                }
            }
        }
    }
}

#if DEBUG

    // MARK: - Medium Widget All Combinations Preview

    private let allSpeciesCases: [Species] = [
        .Cat,
//        .Dog,
//        .Dino,
    ]
    private let allMaturityCases: [Maturity] = [
        .Baby,
//        .Teen,
//        .Adult
    ]
    private let allConditionCases: [Condition] = [
        .Healthy,
//        .Sick,
//        .VerySick,
//        .Dead
    ]

    // Optionally, you can define pet names for each species
//    private func petName(for species: Species) -> String {
//        switch species {
//            case .Cat: return "Billi"
//            case .Dog: return "Max"
//            case .Dino: return "Dino"
//        }
//    }

    // Some test data for each preview, can expand if needed
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

//    struct MediumWidgetAllCombinationsPreview: PreviewProvider {
//        static var previews: some View {
//            Group {
//                ForEach(allSpeciesCases, id: \.self) { species in
//                    ForEach(allMaturityCases.filter { $0 != .Egg }, id: \.self) { maturity in
//                        ForEach(allConditionCases, id: \.self) { condition in
//                            let name = petName(for: species)
//                            let step = stepData(for: condition, maturity: maturity)
//                            let care = careData(for: condition)
//                            StepPalsPhoneWidgetEntryView(
//                                entry: PetEntry(
//                                    date: .now,
//                                    appData: AppData(
//                                        petData: PetData(
//                                            name: name,
//                                            species: species,
//                                            maturity: maturity,
//                                            condition: condition
//                                        ),
//                                        stepData: step,
//                                        careData: care,
//                                        lastUpdated: AppData.dateFormatter.string(from: Date())
//                                    )
//                                )
//                            )
//                            .previewContext(WidgetPreviewContext(family: .systemMedium))
//                            .modifier(ConditionalWidgetBackground())
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
            StepPalsPhoneWidgetEntryView(
                entry: PetEntry(
                    date: .now,
                    appData: AppData(
                        petData: PetData(
                            name: "Billi",
                            species: Species.Cat,
                            maturity: Maturity.Baby,
                            condition: Condition.Healthy
                        ),
                        stepData: StepData(
                            currentSteps: 15000,
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
            )
            .previewContext(WidgetPreviewContext(family: .systemMedium))
            .modifier(ConditionalWidgetBackground())
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
