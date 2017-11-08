//
//  UIViewController.m
//  RNArenaKit
//
//  Created by 陈云杰 on 2017/11/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "UIViewController+Controller.h"

@implementation UIViewController (Controller)

+ (UIViewController *) current {
    UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
    
    if ([rootViewController isKindOfClass: UINavigationController.class]) {
        return ((UINavigationController *)rootViewController).visibleViewController;
    }
    
    if ([rootViewController isKindOfClass:[UITabBarController class]]) {
        return ((UITabBarController *) rootViewController).selectedViewController;
    }
    
    if (rootViewController.presentedViewController != nil) {
        return rootViewController.presentedViewController;
    }
    
    return nil;
}

@end
