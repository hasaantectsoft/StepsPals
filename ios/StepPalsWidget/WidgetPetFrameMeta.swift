//
//  WidgetPetFrameMeta.swift
//  StepPalsWidget
//
//  Frame sizes: keep in sync with `src/components/PetSprites/PetSpriteStill/PetSpriteStill.js` → `META`.
//

import CoreGraphics

enum WidgetPetFrameMeta {
    /// Pixel size of one animation frame in the widget asset strip (same as RN sprite sheets).
    static func firstFrameSize(species: Species, maturity: Maturity, condition: Condition) -> (width: CGFloat, height: CGFloat) {
        switch (species, maturity, condition) {
        case (_, .Egg, let c):
            return firstFrameSize(species: species, maturity: .Baby, condition: c)
        // Cat
        case (.Cat, .Baby, .Healthy): return (31, 32)
        case (.Cat, .Baby, .Sick): return (31, 31)
        case (.Cat, .Baby, .VerySick): return (32, 32)
        case (.Cat, .Baby, .Dead): return (27, 26)
        case (.Cat, .Teen, .Healthy): return (40, 38)
        case (.Cat, .Teen, .Sick): return (40, 38)
        case (.Cat, .Teen, .VerySick): return (43, 35)
        case (.Cat, .Teen, .Dead): return (39, 30)
        case (.Cat, .Adult, .Healthy): return (48, 42)
        case (.Cat, .Adult, .Sick): return (48, 42)
        case (.Cat, .Adult, .VerySick): return (50, 42)
        case (.Cat, .Adult, .Dead): return (46, 34)
        // Dog
        case (.Dog, .Baby, .Healthy): return (37, 32)
        case (.Dog, .Baby, .Sick): return (37, 32)
        case (.Dog, .Baby, .VerySick): return (37, 31)
        case (.Dog, .Baby, .Dead): return (29, 26)
        case (.Dog, .Teen, .Healthy): return (41, 39)
        case (.Dog, .Teen, .Sick): return (41, 38)
        case (.Dog, .Teen, .VerySick): return (41, 38)
        case (.Dog, .Teen, .Dead): return (33, 32)
        case (.Dog, .Adult, .Healthy): return (47, 40)
        case (.Dog, .Adult, .Sick): return (44, 40)
        case (.Dog, .Adult, .VerySick): return (44, 40)
        case (.Dog, .Adult, .Dead): return (39, 35)
        // Dino
        case (.Dino, .Baby, .Healthy): return (36, 33)
        case (.Dino, .Baby, .Sick): return (33, 33)
        case (.Dino, .Baby, .VerySick): return (33, 33)
        case (.Dino, .Baby, .Dead): return (29, 27)
        case (.Dino, .Teen, .Healthy): return (42, 39)
        case (.Dino, .Teen, .Sick): return (40, 38)
        case (.Dino, .Teen, .VerySick): return (40, 38)
        case (.Dino, .Teen, .Dead): return (34, 32)
        case (.Dino, .Adult, .Healthy): return (50, 44)
        case (.Dino, .Adult, .Sick): return (48, 43)
        case (.Dino, .Adult, .VerySick): return (48, 43)
        case (.Dino, .Adult, .Dead): return (39, 36)
        }
    }
}
