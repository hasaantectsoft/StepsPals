//
//  ConditionalWidgetBackground.swift
//  StepPalsWidget
//

import SwiftUI
import WidgetKit

struct ConditionalWidgetBackground: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 17.0, *) {
            content.containerBackground(for: .widget) {
                Color(#colorLiteral(red: 0.994326055, green: 0.9161760211, blue: 0.5334411263, alpha: 1))
            }
        } else {
            content.background(Color(#colorLiteral(red: 0.994326055, green: 0.9161760211, blue: 0.5334411263, alpha: 1)))
        }
    }
}
