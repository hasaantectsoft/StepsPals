import Foundation
import WidgetKit

@objc(StepWidget)
class StepWidget: NSObject {

    private let appGroupID = "group.com.crumbles.shared"
    private let appDataKey = "appData"

    @objc
    func updateAppData(_ json: String) {
        guard let suite = UserDefaults(suiteName: appGroupID),
              let data = json.data(using: .utf8) else { return }
        suite.set(data, forKey: appDataKey)
        suite.synchronize()
        WidgetCenter.shared.reloadAllTimelines()
        PhoneWatchSession.shared.syncAppDataToWatch()
    }

    /// Merges step count into existing widget JSON (used if steps refresh without full home payload).
    @objc
    func updateSteps(_ steps: NSNumber) {
        guard let suite = UserDefaults(suiteName: appGroupID),
              let existing = suite.data(forKey: appDataKey),
              var root = try? JSONSerialization.jsonObject(with: existing) as? [String: Any],
              var stepData = root["stepData"] as? [String: Any] else { return }
        stepData["currentSteps"] = steps.intValue
        root["stepData"] = stepData
        guard let out = try? JSONSerialization.data(withJSONObject: root, options: []) else { return }
        suite.set(out, forKey: appDataKey)
        suite.synchronize()
        WidgetCenter.shared.reloadAllTimelines()
        PhoneWatchSession.shared.syncAppDataToWatch()
    }

    @objc
    static func requiresMainQueueSetup() -> Bool { true }
}
