//
//  WatchConnectivityManager.swift
//  StepPals
//
//  Created by Muhammad Asim Abbas on 12/10/2025.
//

import Combine
import Foundation
import WatchConnectivity
import WidgetKit

class WatchConnectivityManager: NSObject, ObservableObject {
    static let shared = WatchConnectivityManager()

    @Published var appData: AppData?
    @Published var isConnected: Bool = false
    @Published var lastSyncDate: Date?

    private let session: WCSession? = WCSession.isSupported() ? WCSession.default : nil
    private let healthKitManager = WatchHealthKitManager.shared

    override init() {
        super.init()
        setupSession()
        healthKitManager.delegate = self
    }

    private func setupSession() {
        guard let session = session else {
            NSLog("WatchConnectivity is not supported on this device")
            return
        }

        session.delegate = self
        session.activate()
    }

    private func updateLastSyncDate() {
        let now = Date()
        UserDefaults.standard.set(now, forKey: "lastSyncDate")
        self.lastSyncDate = now
    }

    // MARK: - Message Handling

    private func handleReceivedData(_ message: [String: Any]) {
        NSLog("📦 WatchConnectivityManager: Received data: \(String(describing: message["appData"]))")

        if let data = message["appData"] as? Data {
            NSLog("✅ WatchConnectivityManager: data: \(String(describing: data))")
            do {
                let appData: AppData = try JSONDecoder().decode(AppData.self, from: data)
                
                // Save to App Group UserDefaults (same format as Unity saves)
                if let userDefaults = UserDefaults(suiteName: appGroupID) {
                    userDefaults.set(data, forKey: appDataKey)
                    userDefaults.synchronize()
                    WidgetCenter.shared.reloadAllTimelines()
                    NSLog("✅ WatchConnectivityManager: Saved updated data to App Group")
                }
                
                // Update UI properties on main thread (required for @Published properties)
                DispatchQueue.main.async {
                    // Only update if data actually changed to avoid unnecessary UI updates
                    if self.appData?.lastUpdated != appData.lastUpdated {
                        self.appData = appData
                        
                        // Reload widget timelines on main thread
                        WidgetCenter.shared.reloadAllTimelines()
                        NSLog("✅ WatchConnectivityManager: Watch widget reloaded")

                        self.updateLastSyncDate()
                        
                        NSLog("✅ WatchConnectivityManager: Updated UI with new data - Steps: \(String(describing: self.appData?.stepData.currentSteps))/\(String(describing: self.appData?.stepData.stepsGoal))")
                    }
                }
            } catch let decodingError as DecodingError {
                NSLog("❌ WatchConnectivityManager: Failed to decode data - DecodingError: \(decodingError)")
                switch decodingError {
                case .typeMismatch(let type, let context):
                    NSLog("❌ Type mismatch: Expected \(type), path: \(context.codingPath)")
                case .valueNotFound(let type, let context):
                    NSLog("❌ Value not found: \(type), path: \(context.codingPath)")
                case .keyNotFound(let key, let context):
                    NSLog("❌ Key not found: \(key.stringValue), path: \(context.codingPath)")
                case .dataCorrupted(let context):
                    NSLog("❌ Data corrupted: \(context.debugDescription), path: \(context.codingPath)")
                @unknown default:
                    NSLog("❌ Unknown decoding error")
                }
                // Print raw JSON for debugging
                if let jsonString = String(data: data, encoding: .utf8) {
                    NSLog("Raw JSON received: \(jsonString)")
                }
            } catch {
                NSLog("❌ WatchConnectivityManager: Failed to decode data - Error: \(error.localizedDescription)")
                // Print raw JSON for debugging
                if let jsonString = String(data: data, encoding: .utf8) {
                    NSLog("Raw JSON received: \(jsonString)")
                }
            }
        }
    }

    // MARK: - Public Methods
    func requestDataUpdate() {
        guard let session = session, session.isReachable else {
            NSLog("iPhone app is not reachable")
            return
        }

        session.sendMessage(
            ["request": "updateData"],
            replyHandler: { reply in
                self.handleReceivedData(reply)
            }, errorHandler: { error in
                NSLog("Error requesting data: \(error.localizedDescription)")
            }
        )
    }
}

// MARK: - WCSessionDelegate

extension WatchConnectivityManager: WCSessionDelegate {
    func session(
        _ session: WCSession,
        activationDidCompleteWith activationState: WCSessionActivationState,
        error: Error?
    ) {
        DispatchQueue.main.async {
            self.isConnected = (activationState == .activated)
        }

        if let error = error {
            NSLog("WCSession activation failed: \(error.localizedDescription)")
        } else {
            NSLog("WCSession activated successfully")
            // Request initial data
            requestDataUpdate()
        }
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        if let _ = message["appData"] {
            handleReceivedData(message)
        }
    }

    func session(
        _ session: WCSession,
        didReceiveMessage message: [String: Any],
        replyHandler: @escaping ([String: Any]) -> Void
    ) {
        if let _ = message["appData"] {
            handleReceivedData(message)
            replyHandler(["status": "appData received successfully"])
        }
    }

    func session(
        _ session: WCSession,
        didReceiveApplicationContext applicationContext: [String: Any]
    ) {
        if let _ = applicationContext["appData"] {
            handleReceivedData(applicationContext)
        }
    }

    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any]) {
        handleReceivedData(userInfo)
    }

    #if os(iOS)
        func sessionDidBecomeInactive(_ session: WCSession) {
            NSLog("WCSession did become inactive (iOS)")
        }

        func sessionDidDeactivate(_ session: WCSession) {
            NSLog("WCSession did deactivate (iOS)")
            session.activate()
        }
    #endif
}

// MARK: - WatchHealthKitManagerDelegate

extension WatchConnectivityManager: WatchHealthKitManagerDelegate {
    func didUpdateSteps(steps: Int) {
        NSLog("⌚️ WatchConnectivityManager: Received step update from HealthKit: \(steps)")
        
        // Load existing data
        guard var appData = AppData.load() else {
            NSLog("⚠️ WatchConnectivityManager: No existing AppData to update")
            return
        }

        // Update steps and recalculate care
        if appData.stepData.currentSteps == steps {
            NSLog("ℹ️ WatchConnectivityManager: Steps unchanged (\(steps)), skipping update")
        } else {
            let _ = appData.calculateCare(currentSteps: steps)
            
            // Save updated data
            if let (data, _) = appData.save() {
                NSLog("✅ WatchConnectivityManager: Updated AppData with local steps")
                
                // Update UI
                DispatchQueue.main.async {
                    self.appData = appData
                    self.updateLastSyncDate()
                    WidgetCenter.shared.reloadAllTimelines()
                }
            } else {
                NSLog("❌ WatchConnectivityManager: Failed to save updated data")
            }
        }
    }
}
