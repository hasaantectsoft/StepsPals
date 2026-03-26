//
//  StepPalsWatchApp.swift
//  StepPalsWatch Watch App
//

import SwiftUI

@main
struct StepPalsWatch_Watch_AppApp: App {
    init() {
        _ = WatchConnectivityManager.shared
    }

    var body: some Scene {
        WindowGroup {
            AppView()
        }
    }
}
