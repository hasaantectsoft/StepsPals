//
//  Types.swift
//  StepPals
//
//  Created by Muhammad Asim Abbas on 26/10/2025.
//

// MARK: - Species
enum Species: String, Codable {
    case Cat
    case Dog
    case Dino
}

// MARK: - Condition
enum Condition: String, Codable {
    case Healthy
    case Sick
    case VerySick
    case Dead
}

// MARK: - Maturity
enum Maturity: String, Codable {
    case Egg
    case Baby
    case Teen
    case Adult
}

// MARK: - Care Action Types
enum CareType: String {
    case feed
    case giveWater
    case cleanPoop
    case giveTreat
}

// MARK: - CareStatus
enum CareStatus: String, Codable {
    case disabled
    case pending
    case completed
}

// MARK: - TextAlignment
enum TextAlignment {
    case Left
    case Center
    case Right
}

// MARK: - PetData
struct PetData: Codable {
    let name: String
    let species: Species
    let maturity: Maturity
    let condition: Condition

    static let placeholder = PetData(
        name: "Buddy",
        species: Species.Cat,
        maturity: Maturity.Baby,
        condition: Condition.Healthy,
    )
}

// MARK: - StepData
struct StepData: Codable {
    let currentSteps: Int
    let stepsGoal: Int

    var progress: Double {
        guard stepsGoal > 0 else { return 0 }
        return min(Double(currentSteps) / Double(stepsGoal), 1.0)
    }

    var progressPercentage: Int {
        Int(progress * 100)
    }

    var isGoalReached: Bool {
        currentSteps >= stepsGoal
    }

    var remainingSteps: Int {
        max(0, stepsGoal - currentSteps)
    }

    static let placeholder = StepData(
        currentSteps: 5329,
        stepsGoal: 10000,
    )
}

// MARK: - CareData
struct CareData: Codable {
    let feed: CareStatus
    let giveWater: CareStatus
    let cleanPoop: CareStatus
    let giveTreat: CareStatus

    static let placeholder = CareData(
        feed: CareStatus.completed,
        giveWater: CareStatus.pending,
        cleanPoop: CareStatus.disabled,
        giveTreat: CareStatus.disabled,
    )

    /// Get the image name for a care action based on its status
    /// - Parameters:
    ///   - careType: The care action type (Feed, GiveWater, CleanPoop)
    ///   - status: The status from Unity ("disabled", "pending", "completed")
    /// - Returns: The image asset name to display
    static func getImageName(for careType: CareType, status: CareStatus) -> String {
        switch status {
        case CareStatus.disabled:
            return getLockedImageName(for: careType)
        case CareStatus.pending:
            return getUnlockedImageName(for: careType)
        case CareStatus.completed:
            return "care_done"
        }
    }
    
    private static func getLockedImageName(for careType: CareType) -> String {
        switch careType {
        case CareType.feed:
            return "bowl_locked"
        case CareType.giveWater:
            return "bottle_locked"
        case CareType.cleanPoop:
            return "poop_locked"
        case CareType.giveTreat:
            return "bowl_locked" // Not displayed, but provide fallback
        }
    }
    
    private static func getUnlockedImageName(for careType: CareType) -> String {
        switch careType {
        case CareType.feed:
            return "bowl_unlocked"
        case CareType.giveWater:
            return "bottle_unlocked"
        case CareType.cleanPoop:
            return "poop_unlocked"
        case CareType.giveTreat:
            return "bowl_unlocked" // Not displayed, but provide fallback
        }
    }
}
