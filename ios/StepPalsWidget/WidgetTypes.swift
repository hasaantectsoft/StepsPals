//
//  WidgetTypes.swift
//  StepPalsWidget
//

import Foundation

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

// MARK: - PetData

struct PetData: Codable {
    let name: String
    let species: Species
    let maturity: Maturity
    let condition: Condition
}

// MARK: - StepData

struct StepData: Codable {
    var currentSteps: Int
    var stepsGoal: Int

    var progress: Double {
        guard stepsGoal > 0 else { return 0 }
        return min(Double(currentSteps) / Double(stepsGoal), 1.0)
    }

    var progressPercentage: Int {
        Int(progress * 100)
    }
}

// MARK: - CareData

struct CareData: Codable {
    var feed: CareStatus
    var giveWater: CareStatus
    var cleanPoop: CareStatus
    var giveTreat: CareStatus

    static func getImageName(for careType: CareType, status: CareStatus) -> String {
        switch status {
        case .disabled:
            return getLockedImageName(for: careType)
        case .pending:
            return getUnlockedImageName(for: careType)
        case .completed:
            return getDoneImageName(for: careType)
        }
    }

    private static func getDoneImageName(for careType: CareType) -> String {
        switch careType {
        case .feed: return "care_bowl_done"
        case .giveWater: return "care_water_done"
        case .cleanPoop: return "care_poop_done"
        case .giveTreat: return "star_treat_done"
        }
    }

    private static func getLockedImageName(for careType: CareType) -> String {
        switch careType {
        case .feed: return "bowl_locked"
        case .giveWater: return "bottle_locked"
        case .cleanPoop: return "poop_locked"
        case .giveTreat: return "star_treat_locked"
        }
    }

    private static func getUnlockedImageName(for careType: CareType) -> String {
        switch careType {
        case .feed: return "bowl_unlocked"
        case .giveWater: return "bottle_unlocked"
        case .cleanPoop: return "poop_unlocked"
        case .giveTreat: return "star_treat_unlocked"
        }
    }
}
