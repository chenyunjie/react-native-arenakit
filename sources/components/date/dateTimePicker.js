/**
 * Created by dingle on 2017/3/31.
 */
import React, {Component, PropTypes,PureComponent}from 'react';

import {
    View,
    StyleSheet,

} from 'react-native';

import moment from 'moment'

import DLPicker from './dlPicker'
import {padStart} from './numberTool'

class DateTimePicker extends PureComponent {

    static propTypes = {
        lastTime: PropTypes.string,
        startTime: PropTypes.string,
        selectedTime: PropTypes.string,

        onTimeChange:PropTypes.func,

        itemHeight:PropTypes.number,
    };

    constructor(props) {
        super(props);

        // 初始获取 选中年月日
        let selectedDate = moment(props.selectedTime);
        this.selectedYear = selectedDate.get('year');
        this.selectedMonth = selectedDate.get('month') + 1;
        this.selectedDay = selectedDate.get('date');

        // 获取月数组
        let months = [1,2,3,4,5,6,7,8,9,10,11,12];
        this.monthData = months.map((value)=>{
            return {value,label:value+'月'}
        });

        // 获取年数组
        let startYear = parseInt(this.props.startTime.substring(0,4));
        let lastYear = parseInt(this.props.lastTime.substring(0,4));
        this.yearData = [];

        if(__DEV__){console.log('可选年 数据集',startYear,lastYear);}

        for (let i = 0; i <= (lastYear - startYear); i++) {
            let value = startYear + i;
            let label = value + '年';
            this.yearData.push({value, label});

            if(__DEV__) {console.log('+1');}
        }

        // 获取各组初始选中
       this.yearSelectedIndex = this.selectedYear - this.yearData[0].value;
        this.monthSelectedIndex = this.selectedMonth - 1;
        this.daySelectedIndex = this.selectedDay - 1;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.getYearPicker()}
                {this.getMonthPicker()}
                {this.getDayPicker()}
            </View>
        )
    }

//  加载 年 picker
    getYearPicker() {
        return (
            <DLPicker data={this.yearData}
                      itemHeight={this.props.itemHeight}
                      onSelectedItem={this._onSelectedYearItem.bind(this)}
                      selectedIndex={this.yearSelectedIndex}
                      ref={(picker)=>this._yearPicker=picker}
                      key={'year'}
            />
        )
    }

    _onSelectedYearItem(itemData) {
        this.selectedYear = itemData.value;
        this.putSelectedTimeStr()
    }

    //  加载 月 picker
    getMonthPicker(){

        return (
            <DLPicker data={this.monthData}
                      itemHeight={this.props.itemHeight}
                      onSelectedItem={this._onSelectedMonthItem.bind(this)}
                      selectedIndex={this.monthSelectedIndex}
                      ref={(picker)=>this._monthPicker=picker}
                      key={'month'}

            />
        )
    }
    _onSelectedMonthItem(itemData){
        this.setState({
            selectedMonth:itemData.value,
        });
        this.selectedMonth = itemData.value;
        this.putSelectedTimeStr()
    }

//  加载 日 picker
    getDayPicker(){
            let selectedDateFormat = this.selectedYear + '-' + this.selectedMonth;
            let daysNum = moment(selectedDateFormat,'YYYY-MM').daysInMonth();

            let dayData = [];
            for(let i =0;i<daysNum;i++){
                dayData.push({value:i+1,label:(i+1) + '日'});
            }
        return (
            <DLPicker data={dayData}
                      itemHeight={this.props.itemHeight}
                      onSelectedItem={this._onSelectedDayItem.bind(this)}
                      selectedIndex={this.daySelectedIndex}
                      ref={(picker)=>this._dayPicker=picker}
                      key={'day'}
            />

        )
    }
    _onSelectedDayItem(itemData){
        this.selectedDay = itemData.value;
        this.putSelectedTimeStr();
    }

    putSelectedTimeStr(){ // 组装最终数据 -- 上传给父组件
        let selectDate = moment().set({'year': this.selectedYear, 'month': this.selectedMonth-1,'date':this.selectedDay});
        let timeStr = '';


        if(selectDate.isBefore(this.props.startTime)){
            let startMonth = parseInt(this.props.startTime.substring(5,7));
            let startDay = parseInt(this.props.startTime.substring(8,10));

            this._monthPicker.scrollToIndex(startMonth-1);
            this._dayPicker.scrollToIndex(startDay-1);

            this.selectedMonth = startMonth;
            this.selectedDay = startDay;
            timeStr = this.props.startTime;
        }else if(selectDate.isAfter(this.props.lastTime)){

            let lastMonth = parseInt(this.props.lastTime.substring(5,7));
            let lastDay = parseInt(this.props.lastTime.substring(8,10));

            this._monthPicker.scrollToIndex(lastMonth-1);
            this._dayPicker.scrollToIndex(lastDay-1);

            this.selectedMonth = lastMonth;
            this.selectedDay = lastDay;

            timeStr = this.props.lastTime;
        }else {
            let yearStr = this.selectedYear;
            let monthStr = padStart(this.selectedMonth,2,'0');
            let dayStr = padStart(this.selectedDay,2,'0');
            timeStr = yearStr + '-' + monthStr + '-' + dayStr;
        }

        this.props.onTimeChange(timeStr);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'stretch',
    }

});

export default DateTimePicker;