//
//  TreatImageView.swift
//  StepPalsWidget
//
//  Same asset names as `widgetsexanple/Shared/TreatImageView.swift` (star_treat_locked / unlocked / done).
//

import SwiftUI
import WidgetKit

struct TreatImageView: View {
    let careData: CareData
    let stepsPercentage: Int
    let height: Int

    var imageName: String {
        if stepsPercentage >= 100,
            careData.feed == .completed,
            careData.giveWater == .completed,
            careData.cleanPoop == .completed {
            if careData.giveTreat == .completed {
                return "star_treat_done"
            }
            return "star_treat_unlocked"
        }
        return "star_treat_locked"
    }

    var body: some View {
        Image(imageName)
            .resizable()
            .widgetAtlasSampling()
            .modifier(WidgetTintPropertiesModifier())
            .scaledToFit()
            .frame(width: CGFloat(height), height: CGFloat(height))
    }
}
