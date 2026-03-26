//
//  NoPetView.swift
//  StepPalsPhoneWidget
//
//  Created by Muhammad Asim Abbas on 26/10/2025.
//

import SwiftUI
import WidgetKit

struct NoPetView: View {
    @Environment(\.widgetRenderingMode) private var renderingMode

    var body: some View {
        VStack(spacing: 20) {
            Spacer()

            Image("steppals_logo")
                .resizable()
                .modifier(WidgetTintPropertiesModifier())
                .scaledToFit()
                .frame(height: 40)

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

#if DEBUG
struct SmallEmpty: PreviewProvider {
    static var previews: some View {
        StepPalsPhoneWidgetEntryView(
            entry: PetEntry(
                date: .now,
                appData: nil
            )
        )
        .previewContext(WidgetPreviewContext(family: .systemSmall))
        .modifier(ConditionalWidgetBackground())
    }
}

struct MediumEmpty: PreviewProvider {
    static var previews: some View {
        StepPalsPhoneWidgetEntryView(
            entry: PetEntry(
                date: .now,
                appData: nil
            )
        )
        .previewContext(WidgetPreviewContext(family: .systemMedium))
        .modifier(ConditionalWidgetBackground())
    }
}
#endif
