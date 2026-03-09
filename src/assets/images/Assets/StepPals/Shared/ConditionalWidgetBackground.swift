//
//  ConditionalWidgetBackground.swift
//  Unity-iPhone
//
//  Created by Muhammad Asim Abbas on 28/10/2025.
//

import SwiftUI

struct ConditionalWidgetBackground: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 17.0, *), #available(watchOS 10.0, *) {
            content.containerBackground(for: .widget) {
                Color(#colorLiteral(red: 0.994326055, green: 0.9161760211, blue: 0.5334411263, alpha: 1))
            }
        } else {
            content.background(Color(#colorLiteral(red: 0.994326055, green: 0.9161760211, blue: 0.5334411263, alpha: 1)))
        }
    }
}
