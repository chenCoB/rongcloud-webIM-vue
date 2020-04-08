// 融云初始化连接
var RongIMLib = window.RongIMLib;
var RongIMClient = RongIMLib.RongIMClient;


// 发送文字聊天
export function rongSendText(targetId, type, content, extra) {
    /*
    *  targetId 目标id
    *  content  消息内容
    *  extra    附带内容
    *  type     聊天类型 群聊/单聊
    * */
    return new Promise((resolve, reject)=> {
        let msg = new RongIMLib.TextMessage({content: content, extra: extra});
        let conversationType;
        if (type != 'GROUP') {
            conversationType = RongIMLib.ConversationType.PRIVATE;
        } else {
            conversationType = RongIMLib.ConversationType.GROUP
        }

        RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            onSuccess: function (message) {
                resolve(message);
            },
            onError: function (error) {
                reject(error);
            }
        });
    })
}

// 发送图片
export function rongSendImage(type, Imgbase64, imageUrl, targetId, extra) {
    /*
    * e 上传的图片
    * type 类型群聊/单聊
    * targetId 目标id
    *
    * */
    return new Promise((resolve, reject)=>{
        var msg = new RongIMLib.ImageMessage({content: Imgbase64, imageUri: imageUrl, extra: extra});
        var conversationType;
        if (type != 'GROUP') {
            conversationType = RongIMLib.ConversationType.PRIVATE;
        } else {
            conversationType = RongIMLib.ConversationType.GROUP
        }

        RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            onSuccess: function (message) {
                resolve(message)
            },
            onError: function (error) {
                reject(error)
            }
        });
    })

}

// 撤回消息
export function rongRecallMessage(recallMessage) {
    return new Promise((resolve, reject)=> {
        RongIMClient.getInstance().sendRecallMessage(recallMessage, {
            onSuccess: function (message) {
                resolve(message);
            },
            onError: function (error) {
                reject(error)
            }
        });
    })
}
