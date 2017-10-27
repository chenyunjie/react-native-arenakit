import {NativeModules, Platform} from 'react-native';

import AndroidApiMap from './android-api-map';

//提供arena容器通讯能力
const Arena = {

    /**
     * 调用基础容器某个api功能
     *
     * @param parameters
     *      参数中必须包含 method 字段用于说明需要调用的接口
     * @param onSuccess
     *      onSuccess给出回调参数，参数字段为{result:'success|failed', data:{}}
     * @param onFailed
     *      onFailed给出错误参数，参数为 onFailed(errorCode, errorMessage)
     */
    invoke: (parameters, onSuccess, onFailed) => {
        if (!parameters) {
            onFailed("400", "参数不能为空");
        }

        if (!parameters.hasOwnProperty("method")) {
            onFailed("400", "参数必须包含method方法");
        }

        if (Platform.OS === 'ios') {
            if (NativeModules.ReactNativeApi) {
                NativeModules.ReactNativeApi.execute(parameters).then(onSuccess, onFailed);
            } else {
                onFailed("404", "未能找到容器");
            }
        } else {
            let nativeApi = AndroidApiMap[parameters['method']];

            if (nativeApi) {
                let executionMethod = getObjectByPath(nativeApi, NativeModules);
                if (executionMethod) {
                    executionMethod.apply(parameters);
                }
            }
        }
    },

    /**
     * 打开某个微应用
     *
     * @param uri
     * @param parameters
     */
    open: (uri, parameters) => {
        Arena.invoke({method: 'arena.extra.openUri', params:{uri: uri}})
    }
};

//根据属性路径获取对象路径上的属性值
function getObjectByPath(path, target) {

    let paths = path.split('\.');

    let result = target;
    for (let i=0; i<paths.length; i++) {
        let p = paths[i];
        if (result.hasOwnProperty(p)) {
            result = result[p];
        } else {
            result = null;
        }
    }

    return result;
}

module.exports = Arena;