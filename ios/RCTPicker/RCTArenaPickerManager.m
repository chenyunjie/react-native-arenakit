//
//  RCTArenaPickerManager.m
//  ReactNativeArenaKitSupport
//
//  Created by 陈云杰 on 2017/10/30.
//  Copyright © 2017年 江苏斑马软件技术有限公司. All rights reserved.
//

#import "RCTArenaPickerManager.h"


@interface RCTArenaPickerManager()

@property(nonatomic,strong) RCTArenaPicker *pick;
@property(nonatomic,assign)float height;
@property(nonatomic,weak) UIWindow * window;

@end

@implementation RCTArenaPickerManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"pickerEvent"];
}

RCT_EXPORT_METHOD(_init:(NSDictionary *)indic){
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication].keyWindow endEditing:YES];
    });
    
    self.window = [UIApplication sharedApplication].keyWindow;
    
    NSString *pickerConfirmBtnText=indic[@"pickerConfirmBtnText"];
    NSString *pickerCancelBtnText=indic[@"pickerCancelBtnText"];
    NSString *pickerTitleText=indic[@"pickerTitleText"];
    NSArray *pickerConfirmBtnColor=indic[@"pickerConfirmBtnColor"];
    NSArray *pickerCancelBtnColor=indic[@"pickerCancelBtnColor"];
    NSArray *pickerTitleColor=indic[@"pickerTitleColor"];
    NSArray *pickerToolBarBg=indic[@"pickerToolBarBg"];
    NSArray *pickerBg=indic[@"pickerBg"];
    NSArray *selectArry=indic[@"selectedValue"];
    NSArray *weightArry=indic[@"wheelFlex"];
    NSString *pickerToolBarFontSize=[NSString stringWithFormat:@"%@",indic[@"pickerToolBarFontSize"]];
    NSString *pickerFontSize=[NSString stringWithFormat:@"%@",indic[@"pickerFontSize"]];
    NSArray *pickerFontColor=indic[@"pickerFontColor"];
    
    id pickerData=indic[@"pickerData"];
    
    NSMutableDictionary *dataDic=[[NSMutableDictionary alloc]init];
    
    dataDic[@"pickerData"]=pickerData;
    
    [self.window.subviews enumerateObjectsUsingBlock:^(__kindof UIView * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        
        if ([obj isKindOfClass:[RCTArenaPicker class]]) {
            dispatch_async(dispatch_get_main_queue(), ^{
                
                [obj removeFromSuperview];
            });
        }
        
    }];
    
    if ([[UIDevice currentDevice].systemVersion doubleValue] >= 9.0 ) {
        self.height=250;
    }else{
        self.height=220;
    }
    
    self.pick=[[RCTArenaPicker alloc]initWithFrame:CGRectMake(0, SCREEN_HEIGHT, SCREEN_WIDTH, self.height) dic:dataDic leftStr:pickerCancelBtnText centerStr:pickerTitleText rightStr:pickerConfirmBtnText topbgColor:pickerToolBarBg bottombgColor:pickerBg leftbtnbgColor:pickerCancelBtnColor rightbtnbgColor:pickerConfirmBtnColor centerbtnColor:pickerTitleColor selectValueArry:selectArry weightArry:weightArry pickerToolBarFontSize:pickerToolBarFontSize pickerFontSize:pickerFontSize pickerFontColor:pickerFontColor];
    
    __weak typeof(self) weakSelf = self;
    _pick.bolock=^(NSDictionary *backinfoArry){
        dispatch_async(dispatch_get_main_queue(), ^{
            [weakSelf sendEventWithName:@"pickerEvent" body:backinfoArry];
        });
    };
    
    dispatch_async(dispatch_get_main_queue(), ^{
        
        [self.window addSubview:_pick];
        
        [UIView animateWithDuration:.3 animations:^{
            
            [_pick setFrame:CGRectMake(0, SCREEN_HEIGHT-self.height, SCREEN_WIDTH, self.height)];
            
        }];
        
    });
    
}

RCT_EXPORT_METHOD(show){
    if (self.pick) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            [UIView animateWithDuration:.3 animations:^{
                
                [_pick setFrame:CGRectMake(0, SCREEN_HEIGHT-self.height, SCREEN_WIDTH, self.height)];
                
            }];
        });
    }return;
}

RCT_EXPORT_METHOD(hide){
    
    if (self.pick) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [UIView animateWithDuration:.3 animations:^{
                [_pick setFrame:CGRectMake(0, SCREEN_HEIGHT, SCREEN_WIDTH, self.height)];
            }];
        });
    }return;
}

RCT_EXPORT_METHOD(select: (NSArray*)data){
    
    if (self.pick) {
        dispatch_async(dispatch_get_main_queue(), ^{
            _pick.selectValueArry = data;
            [_pick selectRow];
        });
    }return;
}

RCT_EXPORT_METHOD(isPickerShow:(RCTResponseSenderBlock)getBack){
    
    if (self.pick) {
        
        CGFloat pickY=_pick.frame.origin.y;
        
        if (pickY==SCREEN_HEIGHT) {
            
            getBack(@[@YES]);
        }else
        {
            getBack(@[@NO]);
        }
    }else{
        getBack(@[@"picker不存在"]);
    }
}

@end
