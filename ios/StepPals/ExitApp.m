#import "ExitApp.h"

@implementation ExitApp

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(exit) {
  dispatch_async(dispatch_get_main_queue(), ^{
    exit(0);
  });
}

@end
