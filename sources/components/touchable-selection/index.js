import React, {Component} from 'react';

import {
    View, TouchableOpacity, PixelRatio, StyleSheet,Text
} from 'react-native';

import PropTypes from 'prop-types';

/**
 * 点选组件
 *
 * <Selection
 *      selectedIndex={0}
 *      selectedItem={object}
 *      selectableOnEmpty={当selectable为false，即：不可选，selectableOnEmpty为true时则可以选择，忽略selectable参数}
 *      itemRender={选项渲染函数: function(item,index, selected)}
 *      multiple={true|false是否可以多选，默认单选}
 *      dataSource={数据源数组}
 *      itemStyle={选项外观}
 *      itemLabel={展示文本函数 (item)-{}}
 *      selectable={true|false}
 *      horizontalGap={横向间距}
 *      verticalGap={纵向间距}
 *      onChanged={选项被点击事件}
 * />
 *
 */
export default class Selection extends Component {

    static propTypes = {
        selectedIndex: PropTypes.number,
        selectedItem: PropTypes.any,
        selectableOnEmpty: PropTypes.bool,
        itemRender: PropTypes.func,
        multiple: PropTypes.bool,
        dataSource: PropTypes.array.isRequired,
        itemStyle: PropTypes.object,
        itemLabel: PropTypes.func,
        selectable: PropTypes.bool,
        onChanged: PropTypes.func,
        horizontalGap: PropTypes.number,
        verticalGap: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = this.markItemsState(props);
    }

    render() {

        if (!this.props.dataSource || !this.props.dataSource.length) {
            return null;
        }

        let itemViewArray = [];

        let _this = this;
        this.props.dataSource.map((option, index) => {

            let itemView = _this.renderItem(option, index);

            if (itemView) {
                itemViewArray.push(itemView);
            }
        });
        return (
            <View style={[styles.container, this.props.style]}>
                {itemViewArray}
            </View>
        );
    }

    /**
     * 默认选项
     *
     * @param item
     * @param index
     */
    renderItem(item, index) {

        let displayValue = "";

        if (this.props.itemLabel) {
            displayValue = this.props.itemLabel(item, index);
        } else {
            displayValue = item
        }

        let selected = false;
        if (this.state.stateArray && this.state.stateArray.length > index) {
            selected = !!this.state.stateArray[index];
        }

        let itemView = (
            <View style={[
                selected ? styles.optionSelected : styles.optionUnSelected
            ]}>
                <Text
                    style={
                        selected ? styles.optionTextSelected : styles.optionTextUnSelected
                    }>
                    {displayValue}
                </Text>
            </View>
        );
        if (this.props.itemRender) {
            itemView = this.props.itemRender(item, index, selected);
        }

        return (
            <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={() => this.onTapItemAction(item, index)}
                style={[{marginRight: this.props.horizontalGap, marginBottom: this.props.verticalGap}, this.props.itemStyle]}>

                {itemView}
            </TouchableOpacity>
        );
    }

    onTapItemAction(item, index) {

        if (this.selectable === undefined) {
            this.selectable = this.props.selectable;
        }

        if (this.selectable === false) {
            if (!this.selectedItems || this.selectedItems.length === 0) {
                if (this.props.selectableOnEmpty === false) {
                    return;
                } else {
                    this.selectable = true;
                }
            } else {
                return;
            }
        }

        if (this.props.multiple === false) {
            let stateArray = this.state.stateArray;
            stateArray[this.state.lastSelectedIndex] = false;
            stateArray[index] = true;
            this.setState({lastSelectedIndex: index});

            if (this.props.onChanged) {
                this.props.onChanged(item, index, stateArray[index]);
            }
        } else {
            let stateArray = this.state.stateArray;

            stateArray[index] = !stateArray[index];

            this.setState({
                lastSelectedIndex: index,
                stateArray: stateArray
            });

            if (this.props.onChanged) {
                this.props.onChanged(item, index, stateArray[index]);
            }
        }
    }


    /**
     * 设置选项状态
     * @param nextProps
     * @returns {*}
     */
    markItemsState(nextProps) {
        let stateArray = this.props.dataSource.map(() => {return false});
        if (nextProps.selectedIndex || (nextProps.selectedIndex > 0 && nextProps.selectedIndex < nextProps.dataSource.length)) {
            stateArray[nextProps.selectedIndex] = true;
            if (nextProps.onChanged) {
                nextProps.onChanged(nextProps.dataSource[nextProps.selectedIndex], nextProps.selectedIndex, true);
            }
            return {stateArray: stateArray, lastSelectedIndex: nextProps.selectedIndex};
        } else {
            //默认选择项
            if (nextProps.selectedItem) {
                let index = -1;
                nextProps.dataSource.map((o, i) => {
                    let markSelectedItems = [];
                    if (nextProps.selectedItem instanceof Array) {
                        markSelectedItems = nextProps.selectedOption;
                    } else {
                        markSelectedItems = [nextProps.selectedOption]
                    }

                    markSelectedItems.map((markedItem) => {
                        if (this.props.itemLabel) {
                            let markedItemLabel = this.props.itemLabel(markedItem);
                            let itemLabel = this.props.itemLabel(o);
                            if(markedItemLabel === itemLabel) {
                                stateArray[i] = true;
                                index = i;
                            }
                        } else {
                            if (markedItem === o) {
                                stateArray[i] = true;
                                index = i;
                            }
                        }
                    });
                });

                if (nextProps.onChanged && index >= 0) {
                    nextProps.onChanged(nextProps.dataSource[index], index, true);
                }
                return {stateArray: stateArray, lastSelectedIndex: index};
            }
            return {stateArray: stateArray, lastSelectedIndex: -1};
        }
    }

    //获取当前选择项目，暂时不提供设置方法，走props修改
    get selectedItems() {
        let items = [];
        this.state.stateArray.map((o,i) => {
            if (o) {
                items.push(this.props.dataSource[i]);
            }
        });
        return items;
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    optionUnSelected: {
        borderColor: '#dcdcdc',
        borderWidth: 1,
        backgroundColor: 'transparent',
        borderRadius:5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 3,
        paddingBottom: 3
    },
    optionSelected: {
        borderColor: '#00b4ff',
        borderWidth: 1,
        backgroundColor: 'transparent',
        borderRadius:5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 3,
        paddingBottom: 3
    },
    optionTextSelected: {
        marginHorizontal:15,
        color: '#00b4ff',
        fontSize: 12,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    optionTextUnSelected: {
        marginHorizontal:15,
        color: '#999999',
        fontSize: 12,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    }
});