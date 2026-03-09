#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>

extern "C" {
    void RateApp_iOS() {
        if (@available(iOS 10.3, *)) {
            // Use SKStoreReviewController for iOS 10.3+
            [SKStoreReviewController requestReview];
        } else {
            // Fallback for older iOS versions
            NSString *appID = @"6747041627"; // Replace with your App ID
            NSString *urlString = [NSString stringWithFormat:@"itms-apps://itunes.apple.com/app/id%@?action=write-review", appID];
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString] 
                                               options:@{} 
                                     completionHandler:nil];
        }
    }
}
