#import "UnityAppController.h"

extern "C" void RegisterBackgroundTasks();

@interface BackgroundAppController : UnityAppController
@end

@implementation BackgroundAppController

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    // Register background tasks immediately on launch
    RegisterBackgroundTasks();
    
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end

IMPL_APP_CONTROLLER_SUBCLASS(BackgroundAppController)
