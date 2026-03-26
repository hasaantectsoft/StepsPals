//
//  MediumWidgetView.swift
//  StepPalsWidget
//

import SwiftUI
import WidgetKit

struct MediumWidgetView: View {
    let appData: AppData

    var conditionText: String {
        switch appData.petData.condition {
        case .Healthy: return "Healthy"
        case .Sick: return "Sick"
        case .VerySick: return "Very Sick"
        case .Dead: return "Dead"
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
                                .widgetAtlasSampling()
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
                                    total: max(appData.stepData.stepsGoal, 1)
                                )
                                .padding(.top, 12)
                                .padding(.trailing, 23)

                                GeometryReader { geometry in
                                    ZStack(alignment: .leading) {
                                        Image(
                                            CareData.getImageName(
                                                for: .feed,
                                                status: appData.careData.feed
                                            )
                                        )
                                        .resizable()
                                        .widgetAtlasSampling()
                                        .modifier(WidgetTintPropertiesModifier())
                                        .scaledToFit()
                                        .frame(width: 20)
                                        .padding(.leading, -2 + (geometry.size.width * 0.25))

                                        Image(
                                            CareData.getImageName(
                                                for: .giveWater,
                                                status: appData.careData.giveWater
                                            )
                                        )
                                        .resizable()
                                        .widgetAtlasSampling()
                                        .modifier(WidgetTintPropertiesModifier())
                                        .scaledToFit()
                                        .frame(width: 20)
                                        .padding(.leading, -2 + (geometry.size.width * 0.50) - 5)

                                        Image(
                                            CareData.getImageName(
                                                for: .cleanPoop,
                                                status: appData.careData.cleanPoop
                                            )
                                        )
                                        .resizable()
                                        .widgetAtlasSampling()
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
