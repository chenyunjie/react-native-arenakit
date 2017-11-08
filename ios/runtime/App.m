//
//  App.m
//  RNArenaKit
//
//  Created by 陈云杰 on 2017/11/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "App.h"
#import <objc/runtime.h>

@implementation App

- (NSDictionary *) dictionary {
    
    NSMutableArray *propertyKeys = [NSMutableArray array];
    Class currentClass = self.class;
    
    while ([currentClass superclass]) { // avoid printing NSObject's attributes
        unsigned int outCount, i;
        objc_property_t *properties = class_copyPropertyList(currentClass, &outCount);
        for (i = 0; i < outCount; i++) {
            objc_property_t property = properties[i];
            const char *propName = property_getName(property);
            if (propName) {
                NSString *propertyName = [NSString stringWithUTF8String:propName];
                [propertyKeys addObject:propertyName];
            }
        }
        free(properties);
        currentClass = [currentClass superclass];
    }
    
    return [self dictionaryWithValuesForKeys:propertyKeys];
    
}

+ (App *) from: (NSDictionary *) dictionary {
    App *app = [App new];
    
    NSArray *urlArray = [((NSString *)dictionary[@"uri"]) componentsSeparatedByString:@"://"];
    
    app.code = dictionary[@"uri"];
    app.location = dictionary[@"remote_file"];
    app.uri = dictionary[@"vendor_file"];
    if (urlArray && urlArray.count > 1) {
        if ([urlArray[0] isEqualToString:@"rn"]) {
            app.type = 2;
        } else if ([urlArray[0] isEqualToString:@"h5"]) {
            app.type = 1;
        }
        app.name = urlArray[1];
    }
    
    app.version = dictionary[@"version"];
    
    return app;
}

@end
