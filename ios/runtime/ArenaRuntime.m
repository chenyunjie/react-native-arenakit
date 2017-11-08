//
//  ArenaRuntime.m
//  RNArenaKit
//
//  Created by 陈云杰 on 2017/11/5.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ArenaRuntime.h"
#import "Message.h"
#import "App.h"

#define NotificationName @"dispatch"

static NSMutableDictionary *appMap = nil;

static NSMutableDictionary *environments = nil;

static NSString *url = nil;

@implementation ArenaRuntime

+(void) start {
    appMap = [NSMutableDictionary new];
    //监听
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveApi:) name:NotificationName object:nil];
    
    environments = [NSMutableDictionary new];
    [environments setObject:@"http://arena.bm001.com/api/map?platform=ios&category=1&eid=12&pid=10" forKey:@"test"];
    [environments setObject:@"http://arena.bm001.com/api/map?platform=ios&category=1&eid=13&pid=10" forKey:@"production"];
    
    url = [environments valueForKey:@"test"];
}

+(void) environment:(Environment) e {
    if (e == Production) {
        url = [environments valueForKey:@"production"];
    } else {
        url = [environments valueForKey:@"test"];
    }
}

+(App *) appOfKey: (NSString *) key {
    return [appMap objectForKey:key];
}

-(void) didReceiveApi:(NSNotification *) notification {
    NSDictionary *parameters = notification.userInfo;
    NSDictionary *callbackFunction = notification.object;
    
    NSString *method = [parameters objectForKey:@"method"];
    
    if (method != nil) {
        Message *message = [Message new];
        
        if ([method isEqualToString:@"arena.extra.openUri"]) {
            message.type = MessageTypeRedirect;
        } else if ([method isEqualToString:@"arena.biz.micro.close"]) {
            message.type = MessageTypeClose;
        } else if ([ method isEqualToString:@"arena.extra.setResult"]) {
            message.type = MessageTypeSetResult;
        }else if ([ method isEqualToString:@"arena.storage.session.get"]) {
            message.type = MessageTypeSessionGet;
        } else if ([ method isEqualToString:@"arena.storage.session.set"]) {
            message.type = MessageTypeSessionSet;
        } else if ([ method isEqualToString:@"arena.extra.logout"]) {
            message.type = MessageTypeLogout;
        } else {
            message.type = MessageTypeApi;
        }
        
        message.parameters = parameters;
        
        if (callbackFunction) {
            
        }
    }
    
    
}

//加载并缓存app对象
- (void) loadAndCacheMiroApp {
    NSURLSession *session = [NSURLSession sharedSession];
    [[session dataTaskWithURL:[NSURL URLWithString:url]
            completionHandler:^(NSData *data,
                                NSURLResponse *response,
                                NSError *error) {
                NSDictionary *result = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:nil];
                NSArray *routes = [result objectForKey:@"routes"];
                
                //将routes转化为app对象
                for (int i=0; i<routes.count; i++) {
                    App *app = [App from:[routes objectAtIndex:i]];
                    [appMap setObject:app forKey:app.name];
                }
                
            }] resume];
}


@end
