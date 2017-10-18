import {NativeModules} from 'react-native';

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

        if (NativeModules.ReactNativeApi) {
            NativeModules.ReactNativeApi.execute(parameters).then(onSuccess).failed(onFailed);
        } else {
            onFailed("404", "未能找到容器");
        }
    }
};

modules.export = Arena;