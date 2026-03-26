//
//  WidgetPetFirstFrameUIImage.swift
//  StepPalsWidget
//
//  Matches PetSpriteStill.js: rect.setXYWH(0, 0, frameWidth, frameHeight) on the bitmap.
//

import CoreGraphics
import UIKit

enum WidgetPetFirstFrameUIImage {
    /// Crops the leftmost frame from a horizontal strip; `meta` uses the same w/h as `PetSpriteStill` META.
    static func make(named imageName: String, metaWidth fw: CGFloat, metaHeight fh: CGFloat) -> UIImage? {
        guard let image = UIImage(named: imageName),
              let cg = image.cgImage else { return nil }

        let cw = cg.width
        let ch = cg.height
        guard cw > 0, ch > 0, fh > 0, fw > 0 else { return nil }

        // Scale from logical frame height (Skia meta) to this asset’s row height in pixels (@1x/@2x/@3x).
        let rowScale = CGFloat(ch) / fh
        let framePxW = max(1, Int(round(fw * rowScale)))
        let cropW = min(framePxW, cw)

        let rect = CGRect(x: 0, y: 0, width: CGFloat(cropW), height: CGFloat(ch))
        guard let croppedCg = cg.cropping(to: rect) else { return nil }

        return UIImage(cgImage: croppedCg, scale: image.scale, orientation: image.imageOrientation)
    }
}
