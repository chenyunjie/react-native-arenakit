//
//  Message.h
//  RNArenaKit
//
//  Created by 陈云杰 on 2017/11/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, MessageType) {
    MessageTypeApi,
    MessageTypeRedirect,
    MessageTypeClose,
    MessageTypeSetResult,
    MessageTypeSessionGet,
    MessageTypeSessionSet,
    MessageTypeLogout
};

@interface Message : NSObject

//消息类型
@property (nonatomic, assign) MessageType type;

//消息参数
@property (nonatomic, strong) NSDictionary *parameters;

@end
