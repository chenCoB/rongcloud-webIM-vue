<template>
    <div class="home">
        <div class="contact" v-if="show">
            <ul class="contact-ul" v-if="sessionArr.length > 0">
                <li class="contact-li" v-for="item in sessionArr" :key="item.latestMessageId" @click="onChat(item.targetId,item.conversationType, item.latestMessage.content.extra)">
                    <template v-if="item.latestMessage.content">
                        <template v-if="item.conversationType == 3">
                            <img class="portrait" src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                            <div class="chat-info-wrap">
                                <div class="chat-info">
                                    <!--  3群聊 -->
                                    <template v-if="item.conversationType == 3">
                                        <div v-for="value in groupAdd" :key="value.targetId">
                                            <div class="chat-name"   v-if="item.targetId == value.groups_id">{{value.name}}</div>
                                        </div>

                                    </template>
                                    <div class="newest">
                                        <div>
                                            <div>
                                                <span class="newest-user" v-if="item.latestMessage.content.extra">{{ item.latestMessage.content.extra.name}}：</span>
                                                <span class="newest-text" v-if="item.latestMessage.messageType == 'ImageMessage'">[图片]</span>
                                                <span class="newest-text" v-if="item.latestMessage.messageType =='TextMessage'">{{item.latestMessage.content.content}}</span>
                                                <span class="newest-text" v-if="item.latestMessage.messageType =='RecallCommandMessage'">撤回一条信息</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="chat-date" >
                                    <div class="date" >{{item.sentTime | dateFilter}}</div>
                                    <div class="messages-number-wrap">
                                        <div class="messages-number" v-if="item.unreadMessageCount > 0">
                                            {{item.unreadMessageCount}}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </template>
                        <template v-if="item.conversationType == 1 && item.latestMessage.content.extra.sender">

                            <template v-if="item.latestMessage.senderUserId != userModel.user.id">
                                <img v-if="item.latestMessage.content.extra.sender.portrait" class="portrait" :src="item.latestMessage.content.extra.sender.portrait" alt="">
                                <img v-else class="portrait" src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                            </template>
                            <template v-else>
                                <img v-if="item.latestMessage.content.extra.target.portrait" class="portrait" :src="item.latestMessage.content.extra.target.portrait" alt="">
                                <img v-else class="portrait" src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
                            </template>
                            <div class="chat-info-wrap">

                                <div class="chat-info">
                                    <!--  1单聊 -->
                                    <template v-if="item.conversationType == 1">
                                        <div class="chat-name"  v-if="item.latestMessage.content.extra">
                                            <!--发送人的id 等于当前用户的id，就显示对方的名称-->
                                            {{item.latestMessage.senderUserId == userModel.user.id ? item.latestMessage.content.extra.target.name : item.latestMessage.content.extra.sender.name}}
                                        </div>
                                    </template>
                                    <div class="newest">
                                        <div>
                                            <div>
                                                <span class="newest-user" v-if="item.latestMessage.content.extra">{{item.latestMessage.senderUserId == userModel.user.id ? '您' : item.latestMessage.content.extra.sender.name}}：</span>
                                                <span class="newest-text" v-if="item.latestMessage.messageType == 'ImageMessage'">[图片]</span>
                                                <span class="newest-text" v-if="item.latestMessage.messageType =='TextMessage'">{{item.latestMessage.content.content}}</span>
                                                <span class="newest-text" v-if="item.latestMessage.messageType =='RecallCommandMessage'">撤回一条信息</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="chat-date" >
                                    <div class="date" >{{item.sentTime | dateFilter}}</div>
                                    <div class="messages-number-wrap">
                                        <div class="messages-number" v-if="item.unreadMessageCount > 0">
                                            {{item.unreadMessageCount}}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </template>

                    </template>

                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {getToken} from "@/api/user";
    import {groupList} from "../../api/group";
    import {rongInit} from '@/libs/rongcloud/rongcloud-init';
    import {rongUnreadCount, rongClearUnreadCount, rongGetConversationList} from '@/libs/rongcloud/rongcloud-session';
    import {mapState} from 'vuex';
    import ImageUrl from '@/libs/image-url'
    export default {
        data() {
            return {
                show: true,
                groupAdd: [],
                sessionArr: [],
                messages: [],
                appkey: '',
                token: '',
                navi: '',
                rongToken: '',
                initLoading: ''
            }
        },
        created() {
            this.sessionArr = [];
            this.messages = [];
            if (!this.status) {
                this.initLoading = this.$toast.loading('请稍后...', {
                    duration: 0,
                    cover: false
                });
            }
            this.onGetToken();
            this.getGroupList();
        },
        computed: {
            ...mapState({
                status: state=>state.rongCloud.status,
                userModel: state=>state.userModel,
            })
        },
        methods: {
            imageAddress(image) {
                // 拼接头像地址
                return ImageUrl.getChatImage() + '/' + image;
            },
            getRongGetConversationList() {
                // 会话列表
                rongGetConversationList().then((res)=>{
                    this.sessionArr = res;
                })
            },
            onGetToken() {
                getToken(this.appkey).then((res)=>{
                    this.rongToken = res.data.token;
                    localStorage.removeItem('rongToken');
                    localStorage.setItem('rongToken', res.data.token);
                    if (!this.status) {
                        this.init();
                    } else {
                        this.getRongGetConversationList();
                    }
                })
            },
            onChat(targetId, type, chatUser) {
                if (type == 1) {
                    let oppositeName;
                    let portrait;
                    if (chatUser.sender.id != this.userModel.user.id) {
                        oppositeName = chatUser.sender.name;
                        portrait = chatUser.sender.portrait
                    } else {
                        oppositeName = chatUser.target.name;
                        portrait = chatUser.sender.portrait
                    }
                    this.$router.push({
                        path: '/single',
                        query: {
                            targetId: targetId,
                            type: type,
                            chatUser: chatUser,
                            oppositeName: oppositeName,
                            portrait: portrait
                        }
                    });
                } else if (type == 3) {
                    let groupName ;
                    for (let i = 0; i< this.groupAdd.length;i++) {
                        if (targetId == this.groupAdd[i].groups_id) {
                            groupName = this.groupAdd[i].name;
                        }
                    }
                    this.$router.push({
                        path: '/chat',
                        query: {
                            targetId: targetId,
                            type: type,
                            groupName: groupName
                        }
                    });
                }
                this.onRongClearUnreadCount(type, targetId);
            },
            getGroupList() {
                // 群列表
                groupList().then((res)=>{
                    this.groupAdd = res.data;
                })
            },
            onRongClearUnreadCount(type, targetId) {
                // 清除未读消息
                rongClearUnreadCount(type, targetId)
            },
            getRongUnreadCount(type, targetId) {
                // 获取指定的未读消息数
                rongUnreadCount(type, targetId).then((count)=>{
                    this.sessionArr.forEach((item)=>{
                        this.$set(item,'unread', count)
                    });

                })
            },
            addPromptInfo (message) {
                // // 获取最新消息
                if(typeof(message) == 'object') {
                    if ( this.sessionArr.length == 0) {
                        this.sessionArr.push(message);
                    } else {

                        let arr = this.sessionArr.filter((item)=>{
                            return item.targetId == message.targetId
                        });
                        if (arr.length > 0) {
                            for (let i = 0; i <arr.length; i++) {
                                if (arr[i].targetId == message.targetId) {
                                    this.sessionArr
                                    this.sessionArr.unshift(message);

                                }
                            }
                        } else {
                            this.sessionArr.push(message);
                        }

                    }

                }
            },
            init() {

                // 初始化融云
                var appkey = this.appkey;
                var token = this.rongToken;
                if (!appkey || !token) {
                    this.$dialog({
                        title: "错误",
                        content: "appkey 和 token 不能为空",
                        cancelBtnTxt: '知道了',
                        noOkBtn: true
                    });
                } else {
                    let _this = this;
                    rongInit({
                        appkey: appkey,
                        token: token,
                        navi: this.navi
                    }, this.getRongGetConversationList).then(()=>{
                        _this.initLoading.hide();
                        this.getRongGetConversationList();
                        this.$store.commit('setStatus', true);
                    });
                }
            }
        },
        beforeDestroy() {
           if(this.initLoading) {
               this.initLoading.hide();
           }
        }
    }
</script>

<style scoped lang="scss">
    .home {
        padding-top: 36px;
        padding-bottom: 60px;
        .contact {
            &-ul {
                padding: 0 20px
            }
            &-li {
                display: flex;
                align-self: center;
                padding: 10px 0;
                border-bottom: 1PX solid rgba(0, 0, 0, 0.1);

                .portrait {
                    flex: 0 0 40px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                .chat-info-wrap {
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    .chat-info {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        .chat-name {
                            margin-left: 6px;
                            display: inline;
                            height: auto;
                            font-size: 16px;
                        }
                        .newest {
                            min-height: 20px;
                            display: flex;
                            margin-left: 6px;
                            align-content: center;
                            color: rgba(0, 0, 0, 0.4);
                            &-user {
                                font-size: 12px;
                            }
                            &-text {
                                font-size: 12px
                            }
                        }
                    }
                    .chat-date {
                        text-align: right;
                        .date {
                            font-size: 12px;
                        }
                        .messages-number-wrap {
                            height: 18px;
                        }
                        .messages-number {
                            display: inline-block;
                            background: red;
                            width: 18px;
                            height: 18px;
                            color: #fff;
                            font-size: 12px;
                            text-align: center;
                            line-height: 18px;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
    }
</style>
