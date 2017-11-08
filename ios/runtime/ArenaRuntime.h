//
//  ArenaRuntime.h
//  RNArenaKit
//
//  Created by 陈云杰 on 2017/11/5.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "App.h"

typedef NS_ENUM(NSInteger, Environment) {
    Test,
    Production
};

@interface ArenaRuntime : NSObject
/**
 *  启动运行时环境监听
 */
+(void) start;

+(void) environment:(Environment) e;

/**
 *  根据门牌号拿到app对象
 */
+(App *) appOfKey: (NSString *) key;

@end
