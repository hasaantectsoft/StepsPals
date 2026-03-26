//
//  WatchHealthKitManager.swift
//  StepPalsWatchApp
//
//  Created by StepPals on 30/11/2025.
//

import Foundation
import HealthKit

protocol WatchHealthKitManagerDelegate: AnyObject {
    func didUpdateSteps(steps: Int)
}

class WatchHealthKitManager: NSObject {
    static let shared = WatchHealthKitManager()
    
    weak var delegate: WatchHealthKitManagerDelegate?
    
    private let healthStore = HKHealthStore()
    private let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount)!
    
    private override init() {
        super.init()
        requestAuthorization()
    }
    
    func requestAuthorization() {
        guard HKHealthStore.isHealthDataAvailable() else {
            NSLog("❌ WatchHealthKitManager: HealthKit not available")
            return
        }
        
        let typesToRead: Set = [stepType]
        
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
            if success {
                NSLog("✅ WatchHealthKitManager: Authorization successful")
                self.startObservingSteps()
            } else {
                NSLog("❌ WatchHealthKitManager: Authorization failed: \(String(describing: error))")
            }
        }
    }
    
    func startObservingSteps() {
        let query = HKObserverQuery(sampleType: stepType, predicate: nil) { [weak self] query, completionHandler, error in
            if let error = error {
                NSLog("❌ WatchHealthKitManager: Observer query error: \(error.localizedDescription)")
                return
            }
            
            NSLog("⚡️ WatchHealthKitManager: Steps changed (background/foreground)")
            self?.fetchTodaySteps { steps in
                self?.delegate?.didUpdateSteps(steps: steps)
                completionHandler()
            }
        }
        
        healthStore.execute(query)
        
        // Enable background delivery
        healthStore.enableBackgroundDelivery(for: stepType, frequency: .immediate) { success, error in
            if success {
                NSLog("✅ WatchHealthKitManager: Background delivery enabled")
            } else {
                NSLog("❌ WatchHealthKitManager: Failed to enable background delivery: \(String(describing: error))")
            }
        }
    }
    
    func fetchTodaySteps(completion: @escaping (Int) -> Void) {
        let calendar = Calendar.current
        let now = Date()
        let startOfDay = calendar.startOfDay(for: now)
        
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: .strictStartDate)
        
        let query = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            guard let result = result, let sum = result.sumQuantity() else {
                NSLog("❌ WatchHealthKitManager: Failed to fetch steps: \(String(describing: error))")
                completion(0)
                return
            }
            
            let steps = Int(sum.doubleValue(for: HKUnit.count()))
            NSLog("📱 WatchHealthKitManager: Fetched \(steps) steps")
            completion(steps)
        }
        
        healthStore.execute(query)
    }
}
