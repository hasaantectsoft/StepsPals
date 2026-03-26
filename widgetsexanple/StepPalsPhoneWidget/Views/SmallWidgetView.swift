//
//  SmallWidgetView.swift
//  StepPalsPhoneWidget
//
//  Created by Muhammad Asim Abbas on 23/10/2025.
//

import SwiftUI
import WidgetKit

struct SmallWidgetView: View {
    let appData: AppData

    var body: some View {
        VStack(spacing: 6) {
            VStack(spacing: 2) {
                HStack {
                    ZStack(alignment: .leading) {
                        StepProgressView(
                            current: appData.stepData.currentSteps,
                            total: appData.stepData.stepsGoal
                        )
                        .padding(.top, 10)
                        .padding(.trailing, 23)

                        HStack {
                            Spacer()
                            TreatImageView(
                                careData: appData.careData,
                                stepsPercentage: appData.stepData.progressPercentage,
                                height: 34
                            )
                        }
                    }
                }

                HStack(alignment: .top) {
                    Text("\(appData.petData.name)")
                        .foregroundStyle(.black)
                        .font(.custom("PressStart2P-Regular", size: 10))
                        .minimumScaleFactor(0.8)
                        .lineLimit(1)
                        .widgetAccentable()

                    Spacer()

                    VStack(alignment: .trailing) {
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
                                .lineLimit(1)
                        }

                        Text("\(Int(appData.stepData.progressPercentage))%")
                            .foregroundStyle(.black)
                            .font(.custom("PressStart2P-Regular", size: 8))
                            .fontWeight(.semibold)
                            .minimumScaleFactor(0.8)
                            .lineLimit(1)
                    }
                }
            }

            PetImageView(
                species: appData.petData.species,
                maturity: appData.petData.maturity,
                condition: appData.petData.condition,
                height: 70
            )
        }
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#if DEBUG
    // MARK: - Comprehensive Species/Maturity/Condition Previews

    private let previewStepData: [Species: (Int, Int)] = [
        .Cat: (17000, 20000),
        .Dog: (12000, 20000),
        .Dino: (22000, 25000),
    ]

    private let previewCareData: [Species: CareData] = [
        .Cat: CareData(
            feed: .completed,
            giveWater: .pending,
            cleanPoop: .disabled,
            giveTreat: .completed
        ),
        .Dog: CareData(
            feed: .pending,
            giveWater: .completed,
            cleanPoop: .completed,
            giveTreat: .disabled
        ),
        .Dino: CareData(
            feed: .completed,
            giveWater: .completed,
            cleanPoop: .completed,
            giveTreat: .pending
        ),
    ]

    // All valid species, maturities (excluding .Egg), and conditions
    private let allSpecies: [Species] = [
        .Cat
        //        .Dog,
        //        .Dino,
    ]
    private let allMaturities: [Maturity] = [
        .Baby,
        .Teen,
        .Adult,
    ]  // .Egg is excluded
    private let allConditions: [Condition] = [
        .Healthy
        //        .Sick,
        //        .VerySick,
        //        .Dead
    ]

    private func displayName(species: Species, maturity: Maturity, condition: Condition) -> String {
        "\(species.rawValue.capitalized) \(maturity.rawValue.capitalized) \(condition.rawValue.capitalized)"
    }

    struct SmallWidgetAllCombinationsPreview: PreviewProvider {
        static var previews: some View {
            ForEach(allSpecies, id: \.self) { species in
                ForEach(allMaturities, id: \.self) { maturity in
                    ForEach(allConditions, id: \.self) { condition in
                        StepPalsPhoneWidgetEntryView(
                            entry: PetEntry(
                                date: .now,
                                appData: AppData(
                                    petData: PetData(
                                        name: species == .Cat
                                            ? "Billi" : (species == .Dog ? "Doggo" : "Dino"),
                                        species: species,
                                        maturity: maturity,
                                        condition: condition
                                    ),
                                    stepData: {
                                        let (current, goal) =
                                            previewStepData[species] ?? (10000, 20000)
                                        return StepData(
                                            currentSteps: current
                                                - (allMaturities.firstIndex(of: maturity) ?? 0)
                                                * 3000
                                                - (allConditions.firstIndex(of: condition) ?? 0)
                                                    * 1000,
                                            stepsGoal: goal
                                        )
                                    }(),
                                    careData: previewCareData[species]
                                        ?? CareData(
                                            feed: .pending, giveWater: .pending,
                                            cleanPoop: .pending, giveTreat: .pending),
                                    lastUpdated: AppData.dateFormatter.string(from: Date())
                                )
                            )
                        )
                        .previewContext(WidgetPreviewContext(family: .systemSmall))
                        .modifier(ConditionalWidgetBackground())
                        .previewDisplayName(
                            displayName(species: species, maturity: maturity, condition: condition))
                    }
                }
            }
        }
    }
#endif
