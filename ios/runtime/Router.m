//
//  Router.m
//  RNArenaKit
//
//  Created by 陈云杰 on 2017/11/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "Router.h"
#import "UIViewController+Controller.h"
#import "App.h"
#import "ArenaRuntime.h"

static Router *router = nil;

//成功回调映射
static NSMutableDictionary *successResolverMap = nil;

//失败回调映射
static NSMutableDictionary *failResolverMap = nil;

static NSMutableArray *closeViewControllerCallback = nil;

static NSMutableDictionary *sessionMap = nil;
@implementation Router

+ (Router *) defaultRouter {
    if (router == nil) {
        router = [Router new];
        sessionMap = [NSMutableDictionary new];
    }
    return router;
}


- (void) dispatchWithMessage:(Message *) message onSuccess:(void (^)(id)) success onFailed: (void (^)(id)) failed {
    NSDictionary *parameters = message.parameters;
    if (parameters != nil) {
        //取调用方法
        NSString *apiName = [parameters objectForKey:@"method"];
        //取调用所需参数
        NSDictionary *messageParameters = [parameters objectForKey:@"params"];
        
        switch (message.type) {
            case MessageTypeApi:
                //api调用
                [self dispatchApisWithApiName:apiName withParameters: messageParameters onSuccess:success onFailed:failed];
                break;
            case MessageTypeClose:
                [[[UIViewController current] navigationController] popViewControllerAnimated:YES];
                break;
            case MessageTypeSetResult:
                [self dispatchSetResultWithParameters:parameters];
                break;
            case MessageTypeSessionGet:
                [self dispatchSessionGetWithKey:[parameters objectForKey:@"key"]  onSuccess:success onFailed:failed];
                break;
            case MessageTypeSessionSet:
                [self dispatchSessionSetWithValue:[parameters valueForKey:@"key"] forKey:[parameters valueForKey:@"value"] onSuccess:success onFailed:failed];
                break;
            case MessageTypeRedirect:{
                NSString *key = [parameters valueForKey:@"key"];
                
                if (key != nil && (NSNull *) key != [NSNull null]) {
                    
                    App *app = [ArenaRuntime appOfKey:key];
                    if (app != nil && (NSNull *) app != [NSNull null]) {
                        [self dispathcViewControllerWithApp:app withParameters:[parameters valueForKey:@"value"] onSuccess:success onFailed:failed];
                    }
                }
            }
            break;
            case MessageTypeLogout:
            default:
            break;
        }
    }
}

//设置session临时存储
- (void) dispatchSessionSetWithValue:(id) value forKey: (NSString *) key onSuccess:(void (^)(id)) success onFailed: (void (^)(id)) failed {
    
}

//session取值
- (void) dispatchSessionGetWithKey: (NSString *) key onSuccess:(void (^)(id)) success onFailed: (void (^)(id)) failed {
    if (key == nil || (NSNull *)key == [NSNull null]) {
        failed(@"key不能为空");
    } else {
        id value = [sessionMap objectForKey:key];
        
        if (value == nil) {
            success([NSNull null]);
        } else {
            success(value);
        }
    }
}

//set result 往回写值
- (void) dispatchSetResultWithParameters:(NSDictionary *) parameters {
    
    if (closeViewControllerCallback != nil && closeViewControllerCallback.count > 0) {
        ((void (^)(id))closeViewControllerCallback.lastObject)(parameters);
        [closeViewControllerCallback removeLastObject];
        [[[UIViewController current] navigationController] popViewControllerAnimated:YES];
    }
    
}

//分发页面跳转
- (void) dispathcViewControllerWithApp: (App *) app withParameters: (NSDictionary *) parameters onSuccess:(void (^)(id)) success onFailed: (void (^)(id)) failed {
    
    if (closeViewControllerCallback == nil) {
        closeViewControllerCallback = [NSMutableArray new];
    }
    
    [closeViewControllerCallback addObject:success];
    
    
}
//分发api调用
-(void) dispatchApisWithApiName: (NSString *) apiName withParameters: (NSDictionary *) parameters onSuccess:(void (^)(id)) success onFailed: (void (^)(id)) failed {
    
}


@end
