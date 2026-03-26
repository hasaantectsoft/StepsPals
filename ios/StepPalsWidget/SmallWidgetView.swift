//
//  SmallWidgetView.swift
//  StepPalsWidget
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
                            total: max(appData.stepData.stepsGoal, 1)
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
                                .widgetAtlasSampling()
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
