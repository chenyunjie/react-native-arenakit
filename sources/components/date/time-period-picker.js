/**
 * Created by chenyunjie on 2017/7/20.
 */
import React, {PureComponent} from 'react';

import {View, Text} from 'react-native';

import DLPicker from './dlPicker'

import Device from '../device';

export default class TimePeriodPicker extends PureComponent {

    constructor(props) {
        super(props);

        this.periodArray = [
            "00:00",
            "00:30",
            "01:00",
            "01:30",
            "02:00",
            "02:30",
            "03:00",
            "03:30",
            "04:00",
            "04:30",
            "05:00",
            "05:30",
            "06:00",
            "06:30",
            "07:00",
            "07:30",
            "08:00",
            "08:30",
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
            "22:00",
            "22:30",
            "23:00",
            "23:30"
        ].map((item) => {
            return {label: item, value: item}
        });

        this.onStartChangedHandler = this.onStartChangedHandler.bind(this);
        this.onEndChangedHandler = this.onEndChangedHandler.bind(this);
    }

    render() {
        return (
            <View style={{flexDirection: 'row', flex: 3, alignItems: 'center'}}>
                <DLPicker selectedIndex={17}
                          onSelectedItem={this.onStartChangedHandler}
                          itemHeight={this.props.itemHeight}
                          data={this.periodArray} />
                <Text allowFontScaling={false}>至</Text>
                <DLPicker selectedIndex={17}
                          itemHeight={this.props.itemHeight}
                          onSelectedItem={this.onEndChangedHandler}
                          data={this.periodArray} />
            </View>
        );
    }

    onStartChangedHandler(item) {
        this.start = item;
        if (this.props.onTimePeriodChanged) {
            this.props.onTimePeriodChanged(this.start, this.end);
        }
    }

    onEndChangedHandler(item) {
        this.end = item;
        if (this.props.onTimePeriodChanged) {
            this.props.onTimePeriodChanged(this.start, this.end);
        }
    }
}