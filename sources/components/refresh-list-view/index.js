/**
 * 对FlatList进行封装，自带刷新以及加载更多
 *
 *
 * <RefreshListView url={"http://*****"}                   请求的url      必填
 *                  renderItem={(item,index)=>{绘制cell}}   绘制cell      必填
 *                  param={}                               请求的参数      选填
 *                  cellHeight={128}                       行高           选填
 *                  pageSize={10}                          一页显示的条数   选填  默认10条
 *                  authorization={true}                   请求是否需要token  选填  默认true
 *                  emptyTitle={"暂时没有数据"}              没有数据的时候显示的标题   选填
 *                  emptyImage={require('#/images/index/emptyData.png')}   没有数据的时候显示的图标   选填
 *                  getDataAndAssembledDataSource={(data,callback)=>{  数据加载成功的回调   选填
 *                       这里可以对请求的数据进行拼装
 *                       适用需要调用多次接口才能得到最终的数据源
 *                       然后把拼装好的数据源放回到callback中
 *                       callback(finalDataSource)
 *
 *                  }}
 *
 * />
 *
 * Created by zhanglin on 2017/7/14.
 */

import React, {PropTypes} from 'react'
import {View, FlatList, StyleSheet,Text,Image} from 'react-native'
import {MainStyle} from '/config';
import {BasePureComponent} from '/base';
import request from '/utils/request';
import EmptyView from '/modules/empty-view';


export default class RefreshListView extends BasePureComponent {

    static defaultProps = {
        emptyTitle: '暂时没有数据',
        emptyImage: require('#/images/index/emptyData.png'),
        param:{},
        pageSize:10,
        authorization:true
    };

    static propTypes = {
        renderItem:PropTypes.oneOfType([PropTypes.element,PropTypes.func]).isRequired, //绘制cel  必填
        url:PropTypes.string.isRequired, //请求url  必填
        param:PropTypes.object, //请求的参数
        cellHeight:PropTypes.number, //行高
        pageSize:PropTypes.number, //每页显示条数
        authorization:PropTypes.bool, //是否需要token
        emptyTitle:PropTypes.string,  //空数据时显示的标题
        emptyImage:PropTypes.number,  //空数据时显示的图标
        getDataAndAssembledDataSource:PropTypes.func,  //数据加载成功的回调，主要是用来对数据进行二次拼接，从而得到最终的数据源
    };

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            refreshing:false,
        };

        this.param = this.props.param; //请求的参数
        this.pageNum = 0; //当前页码
        this.pageSize = this.props.pageSize; //每页显示条数
        this.totalCount = 0; //总条数


        /*是否正在上拉加载更多
         * 因为如果调用了componentWillReceiveProps这个生命周期的话，会强制的调用上拉加载的回调，不知道为什么，是个坑
         */
        this.isLoadMore = false;

        this._onRefresh = this._onRefresh.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this.loadData = this.loadData.bind(this);

    }

    componentWillReceiveProps(nextProps) {

        /*  如果请求的参数有变化，需要重新进行刷新，
         *  一定要用isObjectValueEqual这个方法去比较两个对象的内容是否一样，否则即使两个对象内容一致，也会判断不一样
         */
        if (nextProps.param &&  !this.isObjectValueEqual(nextProps.param,this.props.param)) {
            this.param = nextProps.param; //参数重新赋值
            this._onRefresh(); //调用下拉刷新方法
        }
    }


    render() {
        return (
            <FlatList {...this.props}
                      style={[this.props.style]}
                      extraData={this.state}
                      data={this.state.data}
                      url={this.props.url}
                      renderItem={this.props.renderItem}
                      cellHeight={this.props.cellHeight}
                      getItemLayout = {this._getItemLayout}
                      onRefresh = {this._onRefresh}
                      refreshing = {this.state.refreshing}
                      onEndReached = {this._onEndReached}
                      onEndReachedThreshold = {0.1}
                      ListEmptyComponent = {this._renderEmptyComponent}
                      ItemSeparatorComponent = {this._renderItemSeparator}
                      keyboardDismissMode = 'on-drag' // 滚动表格隐藏键盘
            />
        )
    }


    /* 获取网络数据
     * @param isLoadMore  是否加载更多
     */
    loadData(isLoadMore){

        let that = this;

        if(!isLoadMore){ //如果是下拉刷新，把当前页和总条数重置为0
            that.pageNum = 0;
            that.totalCount = 0;
        }


        let paramter = {  //把传递的参数和页码他们进行合并，形成最终的参数
            pageNum:that.pageNum,
            pageSize:that.pageSize,
            ...that.param
        };

        request(that.props.url, paramter, (data,success)=>{

            if(success){

                //判断是否需要对数据源进行拼装
                if(that.props.getDataAndAssembledDataSource){  //如果需要对当前请求的数据进行再次拼接

                    that.props.getDataAndAssembledDataSource(data.dataList,(finalData) => {

                        if(finalData){ //如果最终拼接的数据源是有数据的

                            let dataArray = isLoadMore ?  [...that.state.data,...finalData] : finalData ;
                            that.pageNum = that.pageNum + 1;
                            that.totalCount = data.totalCount;

                            that.setState({
                                data:dataArray,
                                refreshing:false,
                            });

                        }else { //否则代表拼接有问题

                            that.setState({
                                data:[],
                                refreshing:false,
                            });
                        }

                        this.isLoadMore = false; //结束正在加载更多

                    })

                }else {  //如果不需要对数据源进行拼接

                    let dataArray = isLoadMore ?  [...that.state.data,...data.dataList] : data.dataList ;
                    that.pageNum = that.pageNum + 1;
                    that.totalCount = data.totalCount;

                    that.setState({
                        data:dataArray,
                        refreshing:false,
                    });

                    this.isLoadMore = false; //结束正在加载更多

                }

            }else {
                that.setState({
                    refreshing:false
                });
                this.isLoadMore = false; //结束正在加载更多
            }

        }, that.props.authorization);


    }


    //绘制分割线视图
    _renderItemSeparator = ()=>{

        return (
            <View style={styles.separatorStyle}/>
        )
    };


    // 预算表格行高
    _getItemLayout = (data,index)=>{
        if(this.props.cellHeight){
            return {length:this.props.cellHeight,offset:(this.props.cellHeight + 0.5) * index,index}
        }
    };

    //上拉加载  第一次进来会触发此方法
    _onEndReached(){

        if(__DEV__){
            console.log("上拉加载中")
        }


        if(!this.isLoadMore) { //如果当前还没有上拉加载，防止连续两次调用上拉加载的方法，这是个坑才这么做的

            this.isLoadMore = true;

            let totalNums = Math.ceil(this.totalCount / this.pageSize);  //计算应该一共有多少页码

            if (this.pageNum === 0 || this.pageNum <= totalNums - 1) {  //如果当前页码是首页并且还不是最后一页，就去加载更多数据
                this.loadData(true);
            }
        }

    }

    //刷新  要手动去刷新才会触发
    _onRefresh () {

        if(__DEV__){
            console.log("下拉刷新中")
        }

        //菊花转起来
        this.setState({
            refreshing:true
        });
        this.loadData(false);
    }

    //如果没有数据的时候显示的内容
    _renderEmptyComponent = () => {
        return(
            <EmptyView topHeight={MainStyle.device.width*0.536}/>

        )
    };


    //比较两个对象的内容是否相等
    static isObjectValueEqual(a, b) {

        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);


        if (aProps.length !== bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        return true;
    }

}

const styles = StyleSheet.create({
    separatorStyle: {
        height:0.5,
        backgroundColor:MainStyle.background.color.assit4
    }


});

