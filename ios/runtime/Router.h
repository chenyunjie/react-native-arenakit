//
//  Router.h
//  RNArenaKit
//
//  Created by 陈云杰 on 2017/11/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Message.h"


@interface Router : NSObject

+ (Router *) defaultRouter;

/**
 *  分发消息，并传入回调
 */
- (void) dispatchWithMessage:(Message *) message onSuccess:(void (^)(id)) success onFailed: (void (^)(id)) failed;

@end
