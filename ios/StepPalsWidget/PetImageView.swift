//
//  PetImageView.swift
//  StepPalsWidget
//

import SwiftUI
import UIKit
import WidgetKit

struct PetImageView: View {
    let species: Species
    let maturity: Maturity
    let condition: Condition
    let height: Int

    /// Widget assets use prefix `WidgetPet` and no underscore (e.g. WidgetPetCatBabyHealthy).
    private var displayMaturity: Maturity {
        maturity == .Egg ? .Baby : maturity
    }

    var imageName: String {
        "WidgetPet\(species.rawValue)\(displayMaturity.rawValue)\(condition.rawValue)"
    }

    /// Same single-frame crop as `PetSpriteStill.js` (first frame at 0,0 with META w×h, scaled to asset @2x/@3x).
    var body: some View {
        let meta = WidgetPetFrameMeta.firstFrameSize(
            species: species,
            maturity: maturity,
            condition: condition
        )
        let displayH = CGFloat(height)

        HStack(alignment: .bottom) {
            if let ui = WidgetPetFirstFrameUIImage.make(named: imageName, metaWidth: meta.width, metaHeight: meta.height) {
                Image(uiImage: ui)
                    .resizable()
                    .widgetAtlasSampling()
                    .modifier(WidgetTintPropertiesModifier())
                    .scaledToFit()
                    .frame(height: displayH)
            } else {
                Image(imageName)
                    .resizable()
                    .widgetAtlasSampling()
                    .modifier(WidgetTintPropertiesModifier())
                    .scaledToFit()
                    .frame(height: displayH)
            }
        }
    }
}
