/**
 * Created by dingle on 2017/9/22.
 */

import React, {PureComponent}from 'react';

import {
    View,
    StyleSheet,

} from 'react-native';

import PropTypes from 'prop-types';
import moment from 'moment'

import DLPicker from './dlPicker'
import {padStart} from './numberTool'

class YearAndMonthPicker extends PureComponent {

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
    }

    render() {
        return (
            <View style={styles.container}>
                {this.getYearPicker()}
                {this.getMonthPicker()}
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

        this.selectedMonth = itemData.value;
        this.putSelectedTimeStr()
    }



    putSelectedTimeStr(){ // 组装最终数据 -- 上传给父组件
        let yearStr = this.selectedYear;
        let monthStr = padStart(this.selectedMonth,2,'0');
        let timeStr = yearStr + '-' + monthStr;

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

export default YearAndMonthPicker;