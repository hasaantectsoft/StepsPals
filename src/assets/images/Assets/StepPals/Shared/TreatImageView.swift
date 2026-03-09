//
//  PetImageView.swift
//  StepPals
//
//  Created by Muhammad Asim Abbas on 23/10/2025.
//

import SwiftUI
import WidgetKit

struct TreatImageView: View {
    let careData: CareData
    let stepsPercentage: Int
    let height: Int

    // This logic is not allowed at the top level in a Swift struct. Instead, use a computed property to decide the image name:
    var imageName: String {
        if stepsPercentage >= 100 &&
            careData.feed == .completed &&
            careData.giveWater == .completed &&
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
            .modifier(WidgetTintPropertiesModifier())
            .scaledToFit()
            .frame(height: CGFloat(height))
    }
}
