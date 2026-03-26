//
//  StepPalsWidgetBundle.swift
//  StepPalsWidget
//
//  Created by Mac2020 on 25/03/2026.
//

import WidgetKit
import SwiftUI

@main
struct StepPalsWidgetBundle: WidgetBundle {
    var body: some Widget {
        StepPalsWidget()
        StepPalsWidgetControl()
        StepPalsWidgetLiveActivity()
    }
}
