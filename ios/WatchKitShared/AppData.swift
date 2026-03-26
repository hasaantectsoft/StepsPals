//
//  AppData.swift
//  StepPalsWidget
//

import CryptoKit
import Foundation

let appGroupID = "group.com.crumbles.shared"
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

    static func isAppGroupConfigured() -> Bool {
        UserDefaults(suiteName: appGroupID) != nil
    }

    mutating func calculateCare(currentSteps: Int) -> [CareType] {
        let calendar = Calendar.current
        var shouldResetDailyData = false

        var lastUpdateDate: Date?

        if let date = AppData.dateFormatter.date(from: self.lastUpdated) {
            lastUpdateDate = date
        } else {
            let fallbackFormatter = ISO8601DateFormatter()
            fallbackFormatter.formatOptions = [.withInternetDateTime]
            fallbackFormatter.timeZone = .current

            if let date = fallbackFormatter.date(from: self.lastUpdated) {
                lastUpdateDate = date
            } else if let date = AppData.legacyFormatter.date(from: self.lastUpdated) {
                lastUpdateDate = date
            }
        }

        if let date = lastUpdateDate {
            if !calendar.isDateInToday(date) {
                shouldResetDailyData = true
            }
        } else {
            shouldResetDailyData = true
        }

        if shouldResetDailyData {
            resetDailyData(currentSteps: currentSteps)
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
            .giveTreat: careData.giveTreat,
        ]

        let goal = Float(stepData.stepsGoal)
        let current = Float(currentSteps)
        let percentage = goal > 0 ? (current / goal) * 100.0 : 0.0

        var previousCareCompletedOrNotApplicable = true
        var unlockedCares: [CareType] = []

        for type in careOrder {
            let currentStatus = newStatuses[type]!

            if petData.condition == .Dead {
                if currentStatus != .completed {
                    newStatuses[type] = .disabled
                }
                previousCareCompletedOrNotApplicable = false
                continue
            }

            if currentStatus == .completed {
                previousCareCompletedOrNotApplicable = true
            } else {
                let threshold = careThresholds[type] ?? 100.0

                if percentage >= threshold && previousCareCompletedOrNotApplicable {
                    if currentStatus == .disabled {
                        unlockedCares.append(type)
                    }
                    newStatuses[type] = .pending
                    previousCareCompletedOrNotApplicable = false
                } else {
                    newStatuses[type] = .disabled
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

        self.stepData = StepData(currentSteps: currentSteps, stepsGoal: stepData.stepsGoal)
        self.lastUpdated = AppData.dateFormatter.string(from: Date())

        return unlockedCares
    }

    mutating func resetDailyData(currentSteps: Int?) {
        stepData = StepData(currentSteps: currentSteps ?? 0, stepsGoal: stepData.stepsGoal)
        careData = CareData(
            feed: .disabled,
            giveWater: .disabled,
            cleanPoop: .disabled,
            giveTreat: .disabled
        )
        lastUpdated = AppData.dateFormatter.string(from: Date())
    }

    func save() -> (data: Data, hash: String)? {
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
            return (data, hash)
        } catch {
            return nil
        }
    }

    static func load() -> AppData? {
        if !AppData.isAppGroupConfigured() {
            return nil
        }

        let userDefaults = UserDefaults(suiteName: appGroupID)

        guard let data = userDefaults?.data(forKey: appDataKey) else {
            return nil
        }

        return try? JSONDecoder().decode(AppData.self, from: data)
    }
}
