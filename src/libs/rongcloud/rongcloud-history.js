// 融云初始化连接
var RongIMLib = window.RongIMLib;
var RongIMClient = RongIMLib.RongIMClient;
// 获取历史记录
export function rongHistoryMessages(type, targetId, timestrap, count) {
    return new Promise((resolve, reject)=>{
        let conversationType;
        if (type != 'GROUP') {
            conversationType = RongIMLib.ConversationType.PRIVATE;
        } else {
            conversationType = RongIMLib.ConversationType.GROUP;
        }

        RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
            onSuccess: function (list, hasMsg) {
                /*
                    list: 获取的历史消息列表
                    hasMsg: 是否还有历史消息可以获取
                  */
                resolve({list, hasMsg})

            },
            onError: function (error) {
                // 请排查：单群聊消息云存储是否开通
                reject(error)
            }
        });
    })
}


export function rongGetConversationList() {
    // 获取列表
    return new Promise((resolve, reject) => {
        var conversationTypes = [ null ];
        var count = 150;
        RongIMClient.getInstance().getConversationList({
            onSuccess: function(list) {
                resolve(list);
            },
            onError: function(error) {
                reject(error);
            }
        }, conversationTypes, count);
    })

}

// 清除列表
export function rongClearRemoteHistoryMessages(type,targetId, timestamp) {
    return new Promise((resolve, reject) => {
        let conversationType;
        if (type != 'GROUP') {
            conversationType = RongIMLib.ConversationType.PRIVATE;
        } else {
            conversationType = RongIMLib.ConversationType.GROUP;
        }
        var params = {
            conversationType: conversationType,
            targetId: targetId,
            timestamp: timestamp // 可取 sentTime, 收发消息和历史消息中都有 sentTime 字段
        };
        RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
            onSuccess: function () {

                resolve();
            },
            onError: function () {
                reject()
            }
        });
    })
}
