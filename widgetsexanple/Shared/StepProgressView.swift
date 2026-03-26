//
//  ProgressView.swift
//  StepPals
//
//  Created by Muhammad Asim Abbas on 23/10/2025.
//

import SwiftUI
import WidgetKit

struct WidgetTintPropertiesModifier: ViewModifier {
    @Environment(\.widgetRenderingMode) var renderingMode

    func body(content: Content) -> some View {
        if renderingMode == .accented {
            content.luminanceToAlpha().widgetAccentable()
        } else {
            content
        }
    }
}

struct StepProgressView: View {
    let current: Int
    let total: Int
    
    var progress: Double {
        return min(Double(current) / Double(total), 1.0)
    }
    
    var body: some View {
        GeometryReader { geometry in
            let availableWidth = geometry.size.width - 22
            let fillWidth = availableWidth * progress
            let barHeight = 4
            
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.182552278, green: 0.2018326819, blue: 0.3142153025, alpha: 1)))
                    .frame(height: CGFloat(barHeight))
                    .padding(.horizontal, 0)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.182552278, green: 0.2018326819, blue: 0.3142153025, alpha: 1)))
                    .frame(height: CGFloat(barHeight + 16))
                    .padding(.horizontal, 8)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.182552278, green: 0.2018326819, blue: 0.3142153025, alpha: 1)))
                    .frame(height: CGFloat(barHeight + 12))
                    .padding(.horizontal, 4)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.9999999404, green: 1, blue: 0.9999999404, alpha: 1)))
                    .modifier(WidgetTintPropertiesModifier())
                    .frame(height: CGFloat(barHeight + 12))
                    .padding(.horizontal, 8)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.182552278, green: 0.2018326819, blue: 0.3142153025, alpha: 1)))
                    .frame(height: CGFloat(barHeight + 8))
                    .padding(.horizontal, 2)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.9999999404, green: 1, blue: 0.9999999404, alpha: 1)))
                    .frame(height: CGFloat(barHeight + 8))
                    .padding(.horizontal, 4)
                    .modifier(WidgetTintPropertiesModifier())
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.9999999404, green: 1, blue: 0.9999999404, alpha: 1)))
                    .frame(height: CGFloat(barHeight))
                    .padding(.horizontal, 2)
                    .modifier(WidgetTintPropertiesModifier())
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.182552278, green: 0.2018326819, blue: 0.3142153025, alpha: 1)))
                    .frame(height: CGFloat(barHeight))
                    .padding(.horizontal, 6)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.182552278, green: 0.2018326819, blue: 0.3142153025, alpha: 1)))
                    .frame(height: CGFloat(barHeight + 8))
                    .padding(.horizontal, 10)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.182552278, green: 0.2018326819, blue: 0.3142153025, alpha: 1)))
                    .frame(height: CGFloat(barHeight + 4))
                    .padding(.horizontal, 8)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.6964579225, green: 0.7912701964, blue: 0.7809845805, alpha: 1)))
                    .frame(height: CGFloat(barHeight))
                    .padding(.horizontal, 8)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.6964579225, green: 0.7912701964, blue: 0.7809845805, alpha: 1)))
                    .frame(height: CGFloat(barHeight + 4))
                    .padding(.horizontal, 10)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.4863021374, green: 0.5510713458, blue: 0.5456481576, alpha: 1)))
                    .frame(height: CGFloat(barHeight + 2))
                    .padding(.top, 2)
                    .padding(.horizontal, 10)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.6227959394, green: 0.6924163699, blue: 0.6869036555, alpha: 1)))
                    .frame(height: CGFloat(barHeight))
                    .padding(.vertical, 2)
                    .padding(.horizontal, 10)
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.1487874985, green: 0.5943421721, blue: 0.853196919, alpha: 1)))
                    .frame(width: fillWidth < 2 ? 0 : fillWidth + 2, height: CGFloat(barHeight + 2))
                    .padding(.top, 2)
                    .padding(.leading, 10)
                    .padding(.trailing, 10)
                    .modifier(WidgetTintPropertiesModifier())
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.6208747625, green: 0.8584584594, blue: 0.9985972047, alpha: 1)))
                    .frame(width: fillWidth < 2 ? 0 : fillWidth + 2, height: CGFloat(barHeight))
                    .padding(.leading, 10)
                    .padding(.trailing, 10)
                    .padding(.bottom, 4)
                    .modifier(WidgetTintPropertiesModifier())
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.6208747625, green: 0.8584584594, blue: 0.9985972047, alpha: 1)))
                    .frame(width: fillWidth, height: CGFloat(barHeight))
                    .padding(.horizontal, 8)
                    .modifier(WidgetTintPropertiesModifier())
                RoundedRectangle(cornerRadius: 0)
                    .fill(Color(#colorLiteral(red: 0.4283347726, green: 0.7923064828, blue: 1, alpha: 1)))
                    .frame(width: fillWidth < 2 ? 0 : fillWidth + 4, height: CGFloat(barHeight))
                    .padding(.leading, 10)
                    .padding(.trailing, 10)
                    .modifier(WidgetTintPropertiesModifier())
            }
        }
        .frame(height: 20)
    }
}
