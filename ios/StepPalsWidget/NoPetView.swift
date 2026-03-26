//
//  NoPetView.swift
//  StepPalsWidget
//

import SwiftUI
import WidgetKit

struct NoPetView: View {
    var body: some View {
        VStack(spacing: 20) {
            Spacer()

            Image("paw_pink")
                .resizable()
                .widgetAtlasSampling()
                .modifier(WidgetTintPropertiesModifier())
                .scaledToFit()
                .frame(height: 48)

            VStack(spacing: 10) {
                Text("No Pet Yet")
                    .foregroundStyle(Color(#colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)))
                    .font(.custom("PressStart2P-Regular", size: 12))
                    .widgetAccentable()

                Text("Open StepPals to adopt a pet!")
                    .foregroundStyle(
                        Color(
                            #colorLiteral(
                                red: 0.1162401512, green: 0.1162401512, blue: 0.1162401512, alpha: 1
                            ))
                    )
                    .font(.custom("PressStart2P-Regular", size: 8))
                    .fixedSize(horizontal: false, vertical: true)
                    .multilineTextAlignment(.center)
                    .lineSpacing(3)
                    .widgetAccentable()
            }
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
