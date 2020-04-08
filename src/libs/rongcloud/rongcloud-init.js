// 融云初始化连接
var RongIMLib = window.RongIMLib;
var RongIMClient = RongIMLib.RongIMClient;
export function rongInit (params, addPromptInfo) {
    return new Promise((resolve,reject)=>{
        var appkey = params.appkey;
        var token = params.token;
        RongIMClient.init(appkey);
        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                switch (status) {
                    case RongIMLib.ConnectionStatus['CONNECTED']:
                    case 0:
                        addPromptInfo('连接成功')
                        break
                    case RongIMLib.ConnectionStatus['CONNECTING']:
                    case 1:
                        addPromptInfo('连接中')
                        break
                    case RongIMLib.ConnectionStatus['DISCONNECTED']:
                    case 2:
                        addPromptInfo('当前用户主动断开链接')
                        break
                    case RongIMLib.ConnectionStatus['NETWORK_UNAVAILABLE']:
                    case 3:
                        addPromptInfo('网络不可用')
                        break
                    case RongIMLib.ConnectionStatus['CONNECTION_CLOSED']:
                    case 4:
                        addPromptInfo('CONNECTION_CLOSED')
                        break
                    case RongIMLib.ConnectionStatus['KICKED_OFFLINE_BY_OTHER_CLIENT']:
                    case 6:
                        addPromptInfo('用户账户在其他设备登录，本机会被踢掉线')
                        break
                    case RongIMLib.ConnectionStatus['DOMAIN_INCORRECT']:
                    case 12:
                        addPromptInfo('当前运行域名错误，请检查安全域名配置')
                        break
                }
            }
        });
        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function (message) {
                addPromptInfo(message)
            }
        });

        RongIMClient.connect(token, {
            onSuccess: function (userId) {
                // 连接成功
                resolve(userId);
            },
            onTokenIncorrect: function () {
                addPromptInfo('token无效')
            },
            onError: function () {
                // 连接失败
                reject();
            }
        }, null)
    })

}

