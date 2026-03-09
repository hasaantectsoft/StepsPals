//
//  AppData.swift
//  StepPals
//
//  Created by Muhammad Asim Abbas on 26/10/2025.
//

import SwiftUI
import WidgetKit
import CryptoKit

let appGroupID = "group.com.benleavitt.steppals.shared"
let appDataKey = "appData"

extension Data {
    var sha256hex: String {
        let digest = SHA256.hash(data: self)
        return digest.map { String(format: "%02x", $0) }.joined()
    }
}

struct AppData: Codable {
    var petData: PetData
    var stepData: StepData
    var careData: CareData
    var lastUpdated: String

    // Define a static formatter to ensure consistency between saving and loading.
    // .withFractionalSeconds ensures we handle high-precision times if needed.
    static let dateFormatter: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        formatter.timeZone = .current
        return formatter
    }()

    static let legacyFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss Z"
        formatter.timeZone = .current
        return formatter
    }()

    static let placeholder = AppData(
        petData: PetData(
            name: "Bolt",
            species: Species.Dino,
            maturity: Maturity.Teen,
            condition: Condition.VerySick
        ),
        stepData: StepData(
            currentSteps: 7589,
            stepsGoal: 10000
        ),
        careData: CareData(
            feed: CareStatus.completed,
            giveWater: CareStatus.completed,
            cleanPoop: CareStatus.pending,
            giveTreat: CareStatus.disabled
        ),
        lastUpdated: dateFormatter.string(from: Date())
    )

    static func isAppGroupConfigured() -> Bool {
        if UserDefaults(suiteName: appGroupID) != nil {
            NSLog("✅ StepPalsAppData: App Group UserDefaults available")
            return true
        } else {
            NSLog("⚠️ StepPalsAppData: App Group UserDefaults not available")
            return false
        }
    }

    // MARK: - Calculate Care Status

    /** Care calculation logic
     * Care order is CareType.feed, CareType.giveWater, CareType.cleanPoop, CareType.giveTreat
     * Each care has three status (CareStatus.disabled, CareStatus.pending, CareStatus.completed). Default status of each care is CareStatus.disabled
     * There are two conditions for a care to have status of CareStatus.pending.
     *  1. Steps percentage should be greater or equal to the threshold of corresponding care
     *  2. The status of previous care (if any in the order) is CareStatus.completed
     * Care having status CareStatus.completed should be untouched unless midnight has passed since last update.
     * If midnight has passed since last update, all cares should be reset to CareStatus.disabled.
     * If petData.condition == Condition.Dead then all cares should be disabled except completed ones.
     */
    mutating func calculateCare(currentSteps: Int) -> [CareType] {
        // Use the user's current calendar (timezone aware)
        let calendar = Calendar.current
        var shouldResetDailyData = false
        NSLog("StepPalsAppData: Existing AppData: \(self)")

        // FIX: Use the shared ISO8601 formatter to parse the string
        var lastUpdateDate: Date?
        
        if let date = AppData.dateFormatter.date(from: self.lastUpdated) {
            NSLog("StepPalsAppData: Shared formatter: \(date)")
            lastUpdateDate = date
        } else {
            // Fallback 1: Try parsing standard ISO without fractional seconds
            let fallbackFormatter = ISO8601DateFormatter()
            fallbackFormatter.formatOptions = [.withInternetDateTime]
            fallbackFormatter.timeZone = .current
            
            if let date = fallbackFormatter.date(from: self.lastUpdated) {
                NSLog("StepPalsAppData: Fallback 1: \(date)")
                lastUpdateDate = date
            } else {
                // Fallback 2: Try parsing legacy format (yyyy-MM-dd HH:mm:ss Z)
                if let date = AppData.legacyFormatter.date(from: self.lastUpdated) {
                    NSLog("StepPalsAppData: Fallback 2: \(date)")
                    lastUpdateDate = date
                }
            }
        }
        
        if let date = lastUpdateDate {
            NSLog("StepPalsAppData: Last Update Date (Local): \(date)")
            
            // Calendar.current.isDateInToday handles the timezone conversion automatically.
            // It checks if 'lastUpdateDate' is "today" according to the device's clock.
            if !calendar.isDateInToday(date) {
                NSLog("StepPalsAppData: Resetting daily data because last update date is not today")
                shouldResetDailyData = true
            }
        } else {
            NSLog("StepPalsAppData: Last update date is invalid or missing: \(self.lastUpdated)")
            shouldResetDailyData = true
        }

        if shouldResetDailyData {
            NSLog("StepPalsAppData: Resetting daily data")
            resetDailyData(currentSteps: currentSteps) // This will reset steps and careData to disabled
            NSLog("StepPalsAppData: New AppData after daily reset: \(self)")
        }
        
        let careThresholds: [CareType: Float] = [
            .feed: 25.0,
            .giveWater: 50.0,
            .cleanPoop: 75.0,
            .giveTreat: 100.0,
        ]

        let careOrder: [CareType] = [.feed, .giveWater, .cleanPoop, .giveTreat]
        
        var newStatuses: [CareType: CareStatus] = [
            .feed: careData.feed,
            .giveWater: careData.giveWater,
            .cleanPoop: careData.cleanPoop,
            .giveTreat: careData.giveTreat
        ]
        
        let goal = Float(stepData.stepsGoal)
        let current = Float(currentSteps)
        let percentage = goal > 0 ? (current / goal) * 100.0 : 0.0
        
        var previousCareCompletedOrNotApplicable = true // Tracks if the *immediately preceding* care was completed or if there was no preceding care (e.g., for .feed)
        var unlockedCares: [CareType] = []
        
        for type in careOrder {
            let currentStatus = newStatuses[type]!
            NSLog("StepPalsAppData: Care Type: \(type), Current Status: \(currentStatus.rawValue)")

            if petData.condition == .Dead {
                // If pet is dead, all non-completed cares become disabled.
                if currentStatus != .completed {
                    newStatuses[type] = .disabled
                }
                // If pet is dead, subsequent cares cannot become pending/completed unless they already were.
                // Setting previousCareCompletedOrNotApplicable to false prevents new ones from becoming pending.
                previousCareCompletedOrNotApplicable = false
                continue // Move to the next care type
            }

            // Rule: Care having status CareStatus.completed should be untouched unless midnight has passed (handled by resetDailyData).
            if currentStatus == .completed {
                // Keep completed status, and allow the next care to potentially become pending.
                previousCareCompletedOrNotApplicable = true
            } else {
                // If not completed, evaluate if it can become pending or should be disabled.
                let threshold = careThresholds[type] ?? 100.0 // Default to 100% if threshold not found

                if percentage >= threshold && previousCareCompletedOrNotApplicable {
                    // Conditions for pending:
                    // 1. Steps percentage >= threshold
                    // 2. The status of previous care (if any in the order) is CareStatus.completed
                    if currentStatus == .disabled {
                        // Only add to unlockedCares if it was previously disabled and now became pending
                        unlockedCares.append(type)
                    }
                    newStatuses[type] = .pending
                    // A pending care does NOT fulfill the 'previous care is completed' requirement for the *next* care.
                    previousCareCompletedOrNotApplicable = false
                } else {
                    // If not completed, and not meeting pending conditions, it should be disabled.
                    newStatuses[type] = .disabled
                    // This care is disabled, so the next care cannot have a completed previous care.
                    previousCareCompletedOrNotApplicable = false
                }
            }
        }
        
        self.careData = CareData(
            feed: newStatuses[.feed]!,
            giveWater: newStatuses[.giveWater]!,
            cleanPoop: newStatuses[.cleanPoop]!,
            giveTreat: newStatuses[.giveTreat]!
        )
        
        // Update step data as well to keep it in sync
        self.stepData = StepData(currentSteps: currentSteps, stepsGoal: stepData.stepsGoal)
        
        // FIX: Save the date using the same ISO8601 formatter
        self.lastUpdated = AppData.dateFormatter.string(from: Date())
        
        return unlockedCares
    }
    
    mutating func degradeCondition() {
        switch petData.condition {
        case .Healthy:
            petData = PetData(name: petData.name, species: petData.species, maturity: petData.maturity, condition: .Sick)
        case .Sick:
            petData = PetData(name: petData.name, species: petData.species, maturity: petData.maturity, condition: .VerySick)
        case .VerySick:
            petData = PetData(name: petData.name, species: petData.species, maturity: petData.maturity, condition: .Dead)
        case .Dead:
            break // Already dead
        }
    }
    
    mutating func resetDailyData(currentSteps: Int?) {
        // Reset steps
        stepData = StepData(currentSteps: currentSteps ?? 0, stepsGoal: stepData.stepsGoal)
        
        // Reset care data to disabled (except if dead, handled by calculateCare logic usually, but here we reset to start of day state)
        careData = CareData(
            feed: .disabled,
            giveWater: .disabled,
            cleanPoop: .disabled,
            giveTreat: .disabled
        )
        
        // FIX: Use the standard formatter for consistency
        lastUpdated = AppData.dateFormatter.string(from: Date())
    }

    func save() -> (data: Data, hash: String)? {
        NSLog("⚠️ StepPalsAppData: Saving app data")
        guard AppData.isAppGroupConfigured() else { return nil }
        do {
            let userDefaults = UserDefaults(suiteName: appGroupID)!
            let data = try JSONEncoder().encode(
                AppData(
                    petData: self.petData,
                    stepData: self.stepData,
                    careData: self.careData,
                    lastUpdated: AppData.dateFormatter.string(from: Date())
                )
            )
            let hash = data.sha256hex
            userDefaults.set(data, forKey: appDataKey)
            userDefaults.set(hash, forKey: "appDataHash")
            userDefaults.synchronize()
            NSLog("✅ StepPalsAppData: Saved app data: \(data)")
            return (data, hash)
        } catch {
            NSLog("❌ StepPalsAppData: Failed to save app data: \(error)")
            return nil
        }
    }

    static func load() -> AppData? {
        NSLog("⚠️ StepPalsAppData: Loading app data")

        if !AppData.isAppGroupConfigured() {
            return nil
        }

        let userDefaults = UserDefaults(suiteName: appGroupID)

        guard let data = userDefaults?.data(forKey: appDataKey) else {
            NSLog("ℹ️ StepPalsAppData: No app data found")
            return nil
        }

        NSLog("⚠️ StepPalsAppData: App data found")

        let appData = try? JSONDecoder().decode(AppData.self, from: data)
        NSLog("✅ StepPalsAppData: Loaded app data: \(appData?.stepData.currentSteps ?? 0) steps")
        return appData
    }

    static func loadDataAndHash() -> (data: Data?, hash: String?) {
        guard let ud = UserDefaults(suiteName: appGroupID) else { return (nil, nil) }
        let data = ud.data(forKey: appDataKey)
        let hash = ud.string(forKey: "appDataHash")
        return (data, hash)
    }
}
