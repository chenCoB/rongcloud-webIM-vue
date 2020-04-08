<template>
    <div class="chat" ref="chat" @click="allAction">
        <div class="chat-header">
            <nut-navbar
                    @on-click-back="back"
                    @on-click-more="more"
            >
                {{groupName}}
            </nut-navbar>
        </div>
        <nut-row class="chat-row">
            <nut-col class="chat-col">
                <nut-scroller
                        :scrollTo="scrollTo"
                        :is-loading="isLoading"
                        @scrollToCbk="scrollToCbk"
                        type="vertical"
                        @pulldown="pulldown"
                >
                    <div slot="list" class="chat-content" ref="chatContent">
                        <div class="chat-content-message" v-for="value in messages" :key="value.sentTime">

                            <template v-if="value.objectName == 'RC:RcCmd'">
                                <div v-if="value.senderUserId != userModel.user.id" class="recall">
                                    对方撤回了一条消息
                                </div>
                                <div v-else class="recall">你撤回了一条消息</div>
                            </template>
                            <template v-else>
                                <div class="chat-layout chat-opposite" v-if="value.senderUserId != userModel.user.id">
                                    <nut-avatar
                                            style="flex: 0 0 32px"
                                            v-if="value.content.extra"
                                            bgIcon=""
                                            :bgImage="value.content.extra.portrait"
                                    >
                                    </nut-avatar>
                                    <nut-avatar
                                            v-else
                                            style="flex: 0 0 32px"
                                            bgIcon=""
                                            bgImage="https://i.loli.net/2017/08/21/599a521472424.jpg"
                                    >
                                    </nut-avatar>
                                    <div v-if="value.messageType == 'ImageMessage'" class="messages-info-left">
                                        <div class="chat-user-name" v-if="value.content.extra">{{value.content.extra.name}}</div>
                                        <img :src="imageAddress(value.content.imageUri)" @click.stop="detailsFigure(value.content.imageUri)" alt="" width="100">
                                        <div class="active-positioning" v-if="value.action">
                                            <ChatAction :recallMessage="value" @recallSucceed="recallSucceed"></ChatAction>
                                        </div>
                                    </div>

                                    <div v-else  class="messages-info-left">
                                        <div class="chat-user-name" v-if="value.content.extra">{{value.content.extra.name}}</div>
                                        <div class="chat-text">{{value.content.content}}</div>
                                        <div class="active-positioning"  v-if="value.action">
                                            <ChatAction :recallMessage="value" @recallSucceed="recallSucceed"></ChatAction>
                                        </div>
                                    </div>

                                </div>
                                <div class="chat-layout chat-our" v-else>
                                    <nut-avatar
                                            style="flex: 0 0 32px;margin-right: 0;margin-left: 10px"
                                            v-if="value.content.extra"
                                            bgIcon=""
                                            :bgImage="value.content.extra.portrait"
                                    >
                                    </nut-avatar>
                                    <nut-avatar
                                            v-else
                                            style="flex: 0 0 32px"
                                            bgIcon=""
                                            bgImage="https://i.loli.net/2017/08/21/599a521472424.jpg"
                                    >
                                    </nut-avatar>
                                    <div v-if="value.messageType == 'ImageMessage'"  class="messages-info-right" >
                                        <div class="chat-user-name" v-if="value.content.extra">{{value.content.extra.name}}</div>
                                        <img :src="imageAddress(value.content.imageUri)" @click.stop="detailsFigure(value.content.imageUri)"  alt="" width="100">
                                        <div class="active-positioning"  v-if="value.action">
                                            <ChatAction :recallMessage="value" @recallSucceed="recallSucceed"></ChatAction>
                                        </div>
                                    </div>

                                    <div v-else class="messages-info-right">
                                        <div class="chat-user-name" v-if="value.content.extra">{{value.content.extra.name}}</div>
                                        <div class="chat-text">{{value.content.content}}</div>
                                        <div class="active-positioning"  v-if="value.action">
                                            <ChatAction :recallMessage="value" @recallSucceed="recallSucceed"></ChatAction>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </nut-scroller>
                <div class="chat-footer">
                    <div class="chat-footer-bg">
                        <nut-row class="chat-footer-flex" type="flex" flexWrap="nowrap">
                            <nut-col span="18">
                                <input class="chat-input" v-model="content" placeholder="请输入发言" />
                            </nut-col>
                            <nut-col span="6">
                                <span class="chat-send" @click="onSend">发送</span>
                            </nut-col>
                            <nut-col span="2">
                                <div class="file-button">
                                    <nut-uploader
                                            @showMsg="showMsg"
                                            :isPreview="true"
                                            :maxSize="5242880"
                                            name="avatar"
                                            :url="url"
                                            @preview = "onPreview"
                                            :acceptType = "['image/jpeg', 'image/png', 'image/gif', 'image/bmp']"
                                            @start="onStart"
                                            :headers="{ 'Accept': 'application/json', 'Authorization': headers.token }"
                                            @success="onSuccess"
                                            @fail="onFail"
                                            :attach="{
                                                avatar: 'file'
                                            }"
                                            typeError="对不起，不支持上传该类型文件！"
                                            limitError="对不起，文件大小超过限制！"
                                    >
                                        <span class="iconfont icon-tupian"></span>
                                    </nut-uploader>
                                </div>
                            </nut-col>
                        </nut-row>
                    </div>
                </div>
            </nut-col>
        </nut-row>
        <div  class="image-pop" v-if="showPopup" @click="showPopup= !showPopup">
            <img :src="currentImage" style="display: block;width: auto; max-width: 80%;max-height: 70%" alt="">
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import {rongInit} from '@/libs/rongcloud/rongcloud-init';
    import {rongSendText, rongSendImage} from '@/libs/rongcloud/rongcloud-messages';
    import {rongHistoryMessages} from '@/libs/rongcloud/rongcloud-history';
    import ChatAction from "../../components/chat-action";
    import {uploadImage} from "../../api/upload";
    import ImageUrl from '@/libs/image-url'

    export default {
        name: "im-chat",
        components: {ChatAction},
        data() {
            return {
                currentImage: '',
                showPopup: false,
                previewBase64: '',
                url: '',
                scrollTo:1,
                initHistory: true,
                sequence: true,
                isLoading: false,
                hasMsg: true, // 是否还有数据
                currentUser: {
                    id: '',
                    name: ''
                },
                headers: {
                    Authorization: ''
                },
                ImageStatus: '',
                groupName: '',
                content: '',
                friendList: [],
                messages: [],
                appkey: '',
                token: '',
                navi: '',
                targetId: '',
                prohibitOperation: false,
            }
        },
        computed: {
            ...mapState({
                status: state=>state.rongCloud.status,
                userModel: state=>state.userModel,
            })
        },
        created() {
            this.targetId = this.$route.query.targetId;
            this.groupName = this.$route.query.groupName;
            this.type = this.$route.query.type == 1 ? 'PRIVATE' : 'GROUP';
            this.init();
            if (this.status) {
                this.getHistoryMessages();
            }
        },
        mounted() {
            this.headers.token = `Bearer ${localStorage.getItem('imToken')}`;
            this.url = uploadImage();
        },
        methods: {
            ...mapActions(['onUser']),
            imageAddress(image) {
                // 拼接聊天地址
                return ImageUrl.getChatImage() + '/' + image.path;
            },
            detailsFigure(image) {
               // 放大当前图片
                this.showPopup = !this.showPopup;
               this.currentImage =  ImageUrl.getChatImage() +'/' + image.path
            },
            scrollToCbk(h) {
                this.scrollTo = h;
            },
            onStart() {
                // 上传中
                this.prohibitOperation = true;
                window.ImageStatus = this.$toast.loading('发送中...',{
                    duration:0,
                    cover:false
                });
            },
            onPreview(base64) {

                // h获取上传图片的base64
                this.previewBase64 = base64;
            },
            showMsg() {
                this.$dialog({
                    noOkBtn: true,
                    title: "失败",
                    cancelBtnTxt: '知道了',
                    content: '图片太大请不要超过5M'
                })
            },
            onSuccess(e, text) {
                // 上传成功
                this.$toast.success('发送成功！');
                this.prohibitOperation = false;
                window.ImageStatus.hide();
                let imageUrl = JSON.parse(text);
                this.onUpFile(imageUrl);
            },
            onFail() {
                // 上传失败
                window.ImageStatus.hide();
                this.$dialog({
                    noOkBtn: true,
                    title: "失败",
                    cancelBtnTxt: '知道了',
                    content: '上传失败'
                })
            },
            onActive(messageid, seedId, myId) {
                // 长按显示删除/撤回
                if (seedId != myId) return false;
                this.messages.forEach((item)=>{
                    if (item.messageId == messageid) {
                        this.$set(item, 'action', true)
                    }
                })
            },
            recallSucceed(id) {
                // 撤回成功回调
                let arr = this.messages;
                for (let i=0; i < arr.length;i ++) {
                    if (this.messages[i].messageId == id) {
                        this.messages[i].objectName = 'RC:RcCmd';
                    }
                }
            },
            allAction() {
                // 隐藏撤回/删除按钮
                this.messages.forEach((item)=>{
                    this.$set(item, 'action', false)
                })
            },
            onUpFile(imageUrl) {
                // 发送图片
               this.dealImage(this.previewBase64, 300 , (base64)=>{
                    rongSendImage(this.type, base64, imageUrl, this.targetId, this.userModel.user).then((message)=>{
                        this.messages.push(message);
                        this.onScroller();
                    }).catch((error)=>{
                        console.log(error)
                    })
                })

            },
            dealImage(base64, w, callback) {
                // 压缩
                var newImage = new Image();
                var quality = 0.6;    //压缩系数0-1之间
                newImage.src = base64;
                newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
                var imgWidth, imgHeight;
                newImage.onload = function () {
                    imgWidth = this.width;
                    imgHeight = this.height;
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    if (Math.max(imgWidth, imgHeight) > w) {
                        if (imgWidth > imgHeight) {
                            canvas.width = w;
                            canvas.height = w * imgHeight / imgWidth;
                        } else {
                            canvas.height = w;
                            canvas.width = w * imgWidth / imgHeight;
                        }
                    } else {
                        canvas.width = imgWidth;
                        canvas.height = imgHeight;
                        quality = 0.6;
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                    var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
                    // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
                    while (base64.length / 1024 > 100) {
                        quality -= 0.01;
                        base64 = canvas.toDataURL("image/jpeg", quality);
                    }
                    //  防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
                    while (base64.length / 1024 < 0) {
                        quality += 0.001;
                        base64 = canvas.toDataURL("image/jpeg", quality);
                    }
                    callback(base64);//必须通过回调函数返回，否则无法及时拿到该值
                }
            },
            pulldown() {
                // 下拉加载
                this.isLoading = true;
                this.getHistoryMessages();
            },
            back(){
                if (!this.prohibitOperation){
                    this.$router.push('/');
                }

            },
            more(){
                // 群详情
                if (!this.prohibitOperation) {
                    this.$router.push({
                        path: '/chat/group/details',
                        query: {
                            name: this.groupName,
                            type: this.type,
                            timestamp: this.messages[0] ? this.messages[this.messages.length - 1].sentTime : '',
                            targetId: this.targetId
                        }
                    });
                }
            },
            onCurrent(id) {
                for(var i = 0; i < this.friendList.length; i++) {
                    if(this.friendList[i].id == id) {
                        this.currentUser.id = this.friendList[i].id;
                        this.currentUser.name = this.friendList[i].name;
                    }
                }
            },
            addPromptInfo (message) {

                if(typeof(message) == 'object') {
                    if (message.targetId == this.targetId) {
                        if (message.objectName == 'RC:RcCmd') {
                            let arr = this.messages;
                            for (let i=0; i < arr.length;i ++) {
                                if (this.messages[i].messageUId == message.content.messageUId) {
                                    this.messages[i].objectName = 'RC:RcCmd';
                                }
                            }
                        } else {
                            message.action = false;
                            this.messages.push(message);
                            this.onScroller();
                        }
                    }
                }
                if (this.initHistory) {
                    this.initHistory = false;
                    this.getHistoryMessages();
                }

            },
            onSend() {
                // 融云发送聊天
                if (this.content) {
                    if (this.content.match(/^[ ]*$/)) {
                        this.$dialog({
                            title: "错误",
                            content: "不能为空",
                            cancelBtnTxt: '知道了',
                            noOkBtn: true
                        });
                        return false
                    }
                    rongSendText(this.targetId,this.type,this.content,this.userModel.user).then((message)=>{
                        this.content = '';
                        message.action = false;
                        this.messages.push(message);
                        this.onScroller();
                    }).catch((error)=>{
                        console.log(error);
                    });
                } else {
                    this.$dialog({
                        title: "错误",
                        content: "不能为空",
                        cancelBtnTxt: '知道了',
                        noOkBtn: true
                    });
                }

            },
            onScroller() {
                // 滚动距离
                if(this.$refs.chatContent) {
                    let time = setTimeout(() => {
                        var h = this.$refs.chatContent.clientHeight;
                        var chatHeight = this.$refs.chat.clientHeight;
                        this.scrollToCbk((chatHeight - 100) - h);
                        clearTimeout(time);
                    }, 500)
                }

            },
            getHistoryMessages() {
                // 获取历史记录
                let targetId = String(this.targetId);  // 目标 Id
                let count = 5; // 每次获取的数据条数
                let timestrap; //
                if (this.sequence) {
                    timestrap = 0; // 第一次获取用当前时间
                } else {
                    // 第二次用最后一条记录的时间获取数据
                    if (this.messages.length > 0) {
                        timestrap = this.messages[0].sentTime
                    }
                }
                this.initHistory = false;
                rongHistoryMessages(this.type, targetId, timestrap, count).then((res) => {
                    this.isLoading = false;
                    this.hasMsg = res.hasMsg;
                    if (this.sequence) {
                        for (let i = 0; i < res.list.length; i++) {
                            res.list[i].action = false;
                            this.messages.push(res.list[i]);
                        }
                        this.onScroller();
                        this.sequence = false;
                    } else {
                        let arr = res.list.reverse();
                        for (let i = 0; i < arr.length; i++) {
                            res.list[i].action = false;
                            this.messages.unshift(res.list[i]);
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            init() {
                let rongToken = localStorage.getItem('rongToken');
                var appkey = process.env.VUE_APP_RONGCLOUD_KEY;
                var token = rongToken;
                if (!appkey || !token) {
                    this.$dialog({
                        title: '提示',
                        content: 'appkey 和 token 不能为空'
                    })
                } else {
                    rongInit({
                        appkey: appkey,
                        token: token,
                        navi: this.navi
                    }, this.addPromptInfo).then(()=>{
                        this.$store.commit('setStatus', true);
                    })
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .chat {
        box-sizing: border-box;
        padding: 40px 10px;
        padding-bottom: 50px;
        height: 100vh;
        .chat-header {
            position: fixed;
            height: 40px;
            left: 0;
            top: 0;
            width: 100%;
            z-index: 99;
            background: #fff;
            justify-content: space-between;
            box-shadow: 0px 6px 10px rgba(45, 140, 240, 0.3);
        }
        .chat-row {
            height: 100%;
        }
        .chat-col {
            height: 100%;
        }

        .chat-content {
            .messages-info-left {
                position: relative;
                .active-positioning {
                    z-index: 10;
                    position: absolute;
                    right: -26px;
                }
            }
            .messages-info-right {
                position: relative;
                .active-positioning {
                    z-index: 10;
                    position: absolute;
                    left: 0px;
                }
            }

            &-message {
                padding: 10px 0;
                .recall {
                    text-align: center;
                    font-size: 12px;
                }
                .chat-layout {
                    position: relative;
                    display: flex;
                    align-self: center;
                    margin-bottom: 10px;
                    .user-avatar {
                        top: 0px;
                        position: absolute;
                    }
                    .chat-user-name {
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.5);
                    }

                }
                .chat-opposite {
                    text-align: left;

                    .chat-text {
                        max-width: 400px;
                        color: #fff;
                        padding: 6px;
                        background: #2D8CF0;
                        border-radius: 6px;
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        display: inline-block;
                        font-size: 14px;
                    }
                    .user-avatar {
                        left: 0px;
                    }
                }

                .chat-our {
                    text-align: right;
                    display: flex;
                    flex-direction: row-reverse;
                    .chat-text {
                        color: #fff;
                        padding: 6px;
                        background: #2D8CF0;
                        border-radius: 6px;
                        border: 1px solid rgba(0, 0, 0, 0.2);
                        display: inline-block;
                        max-width: 400px;
                        font-size: 14px;
                        text-align: left;

                    }
                    .user-avatar {
                        right: 0px;
                    }

                }
            }
        }
        .chat-footer {
            background: #fff;
            position: fixed;
            width: 100%;
            bottom: 0;
            left: 0;
            .chat-footer-bg {
                width: 100%;
                height: 100%;
                padding: 10px;
                box-sizing: border-box;
                background-color: rgba(0,0,0,0.1);
                .chat-input {
                    width: 100%;
                    height: 42px;
                    border: 0;
                    border-radius: 0;
                    padding: 0 10px;
                    box-sizing: border-box;
                }
                .chat-send {
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 42px;
                    background-color: #666666;
                    color: #fff;
                    text-align: center;
                }
                .file-button {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .iconfont {
                        padding-left: 12px;
                        font-size: 24px;
                    }
                    input {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                    }
                }
            }
        }
        .image-pop {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0,0,0,0.6);
            z-index: 99;
        }
    }
</style>
