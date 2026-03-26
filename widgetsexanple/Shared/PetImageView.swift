//
//  PetImageView.swift
//  StepPals
//
//  Created by Muhammad Asim Abbas on 23/10/2025.
//

import SwiftUI
import WidgetKit

struct PetImageView: View {
    let species: Species
    let maturity: Maturity
    let condition: Condition
    let height: Int

    var imageName: String {
        "\(species.rawValue)_\(maturity.rawValue)_\(condition.rawValue)"
    }

    var body: some View {
        HStack(alignment: .bottom) {
            Image(imageName)
                .resizable()
                .modifier(WidgetTintPropertiesModifier())
                .scaledToFit()
                .frame(height: CGFloat(height))
        }
    }
}
