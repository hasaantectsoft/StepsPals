//
//  StepPalsWidgetLiveActivity.swift
//  StepPalsWidget
//
//  Created by Mac2020 on 25/03/2026.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct StepPalsWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct StepPalsWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: StepPalsWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension StepPalsWidgetAttributes {
    fileprivate static var preview: StepPalsWidgetAttributes {
        StepPalsWidgetAttributes(name: "World")
    }
}

extension StepPalsWidgetAttributes.ContentState {
    fileprivate static var smiley: StepPalsWidgetAttributes.ContentState {
        StepPalsWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: StepPalsWidgetAttributes.ContentState {
         StepPalsWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: StepPalsWidgetAttributes.preview) {
   StepPalsWidgetLiveActivity()
} contentStates: {
    StepPalsWidgetAttributes.ContentState.smiley
    StepPalsWidgetAttributes.ContentState.starEyes
}
