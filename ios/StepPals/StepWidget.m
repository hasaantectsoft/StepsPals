#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(StepWidget, NSObject)

RCT_EXTERN_METHOD(updateAppData:(NSString *)json)
RCT_EXTERN_METHOD(updateSteps:(nonnull NSNumber *)steps)

@end
