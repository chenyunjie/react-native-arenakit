//
//  App.h
//  RNArenaKit
//
//  Created by 陈云杰 on 2017/11/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface App : NSObject

//编号
@property (nonatomic, strong) NSString *code;

//名称
@property (nonatomic, strong) NSString *name;

//bundle或html页面地址
@property (nonatomic, strong) NSString *location;

//应用类型 1-html5 2-react native
@property (nonatomic, assign) int type;

//资源标识符
@property (nonatomic, strong) NSString *uri;

//版本
@property (nonatomic, strong) NSString *version;

//微应用模块名称
@property (nonatomic, strong) NSString *moduleName;

//转化为dictionary对象
- (NSDictionary *) dictionary;

//从dictionary读取并转化为App对象
+ (App *) from: (NSDictionary *) dictionary;

@end
