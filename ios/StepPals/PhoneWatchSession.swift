import Foundation
import WatchConnectivity

/// Relays `appData` JSON (App Group) to the paired Apple Watch via WatchConnectivity.
final class PhoneWatchSession: NSObject, WCSessionDelegate {
    static let shared = PhoneWatchSession()

    func activate() {
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    /// Pushes the latest widget payload so the watch app / complications refresh when the phone is not reachable for `sendMessage`.
    func syncAppDataToWatch() {
        let session = WCSession.default
        guard session.activationState == .activated else { return }
        guard let suite = UserDefaults(suiteName: "group.com.crumbles.shared"),
              let data = suite.data(forKey: "appData") else { return }
        let payload: [String: Any] = ["appData": data]
        do {
            try session.updateApplicationContext(payload)
        } catch {
            session.transferUserInfo(payload)
        }
    }

    func session(
        _ session: WCSession,
        didReceiveMessage message: [String: Any],
        replyHandler: @escaping ([String: Any]) -> Void
    ) {
        if message["request"] as? String == "updateData" {
            let suite = UserDefaults(suiteName: "group.com.crumbles.shared")
            if let data = suite?.data(forKey: "appData") {
                replyHandler(["appData": data])
            } else {
                replyHandler([:])
            }
            return
        }
        replyHandler([:])
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        _ = message
    }

    func sessionDidBecomeInactive(_ session: WCSession) {}

    func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }

    func session(
        _ session: WCSession,
        activationDidCompleteWith activationState: WCSessionActivationState,
        error: Error?
    ) {
        if activationState == .activated {
            syncAppDataToWatch()
        }
    }
}
