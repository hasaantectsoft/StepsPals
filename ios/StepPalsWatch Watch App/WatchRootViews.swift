//
//  WatchRootViews.swift
//  StepPalsWatch Watch App
//

import SwiftUI
import WidgetKit

struct AppView: View {
    @ObservedObject private var connectivityManager = WatchConnectivityManager.shared

    var body: some View {
        Group {
            if let appData = connectivityManager.appData {
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
            connectivityManager.requestDataUpdate()
        }
    }
}

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
