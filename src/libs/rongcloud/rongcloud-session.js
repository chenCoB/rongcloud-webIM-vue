var RongIMLib = window.RongIMLib;
var RongIMClient = RongIMLib.RongIMClient;


// 获取列表
export function rongGetConversationList() {
    return new Promise((resolve,reject)=> {
        var conversationTypes = [RongIMLib.ConversationType.PRIVATE, RongIMLib.ConversationType.GROUP];
        var count = 150;
        RongIMClient.getInstance().getConversationList({
            onSuccess: function (list) {
                resolve(list);
            },
            onError: function (error) {
                reject(error);
            }
        }, conversationTypes, count);
    })
}


export function rongClearUnreadCount(type, targetId) {
    // 清除指定会话未读
    return new Promise((resolve,reject)=> {
        let conversationType;
        if (type == 1) {
            conversationType = RongIMLib.ConversationType.PRIVATE;
        } else {
            conversationType = RongIMLib.ConversationType.GROUP;
        }
        RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
            onSuccess: function () {
                resolve()
            },
            onError: function (error) {
                reject(error)
            }
        });
    })
}

export function rongTotalUnreadCount() {
    // 获取所有会话未读数
    return new Promise((resolve,reject)=> {
        RongIMClient.getInstance().getTotalUnreadCount({
            onSuccess: function(count) {
                resolve(count)
            },
            onError: function(error) {
                reject(error)
            }
        });
    })
}

export function rongUnreadCount(type, targetId) {
    // 获取指定会话未读数
    return new Promise((resolve,reject)=> {
        let conversationType;
        if (type != 'GROUP') {
            conversationType = RongIMLib.ConversationType.PRIVATE;
        } else {
            conversationType = RongIMLib.ConversationType.GROUP;
        }
        RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
            onSuccess: function(count) {
                resolve(count)
            },
            onError: function(error) {
                reject(error)
            }
        });
    })
}
