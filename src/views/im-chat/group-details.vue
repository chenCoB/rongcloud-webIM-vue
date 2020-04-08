<template>
    <div class="chat">
        <div class="chat-header">
            <nut-navbar
                    :rightShow="false"
                    @on-click-back="back"
                    @on-click-title="title"
            >
                {{title}} ({{groupDetails.number}}人)
            </nut-navbar>
        </div>
        <nut-cell :desc="groupDetails.groupName" :show-icon="true" @click-cell="setStatus">
            <span slot="title" style="width: 80px;display: inline-block">群聊名称</span>
            <span slot="desc">{{groupDetails.groupName}}</span>
        </nut-cell>
        <nut-cell :is-link="true" :show-icon="true" @click-cell="toNotice">
            <span slot="title">群公告</span>
            <span slot="sub-title" style="width: 100%;display: block;word-break: break-all;
text-overflow: ellipsis;
overflow: hidden;
display: -webkit-box;
-webkit-line-clamp: 1;
-webkit-box-orient: vertical;">{{groupDetails.announcement ? groupDetails.announcement : '~当前没有群公告'}}</span>
            <span slot="desc" :show-icon="true"></span>
        </nut-cell>
        <div class="member-list">
            <UserAvatar avatar-width="45" v-for="(val,index) in groupDetails.members" :key="index" :info="val"></UserAvatar>
        </div>
        <div class="more">
            <span class="more-text" @click="onMore">查看更多成员</span>
        </div>
        <div class="separate"></div>


        <div class="remove-messages"  @click="removeMessages">
            删除聊天记录
        </div>
        <div class="editor-dialog" v-if="status">
            <div class="dialog-content">
                <div class="title">
                    修改群名
                </div>
                <div class="body">
                    <nut-textinput
                            placeholder="请输入要修改的群名称"
                            v-model="value"
                            type="text"
                    />
                </div>
                <div>
                    <nut-button
                            type="light"
                            @click="status = !status"
                    >
                        关闭
                    </nut-button>
                    <nut-button @click="editorName">
                        确定
                    </nut-button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import UserAvatar from "../../components/user-avatar";
    import {groupMembers, groupInfo, groupeditName} from "../../api/group";
    import {rongClearRemoteHistoryMessages} from "../../libs/rongcloud/rongcloud-history";

    export default {
        name: "group-details",
        components: {UserAvatar},
        data() {
            return {
                groupDetails: '',
                targetId: '',
                title: '群聊资料',
                type: '',
                value: '',
                status: false,
                member: [],
                timestamp: '', //收到的时间
                initLoading: ''

            }
        },
        created() {
            this.initLoading = this.$toast.loading('请稍后...', {
                duration: 0,
                cover: false
            });
            this.type = this.$route.query.type;
            this.targetId = this.$route.query.targetId;
            this.timestamp = this.$route.query.timestamp
            this.getRroupMembers();
            this.getRroupInfo();
        },
        methods: {
            back() {
                // 后退
                this.$router.push({
                    path: '/chat',
                    query: {
                        targetId: this.targetId,
                        type: this.type,
                        groupName: this.groupDetails.groupName
                    }
                });
            },
            getRroupInfo() {
                // 群详情
                groupInfo(this.targetId).then((res)=>{
                    this.groupDetails = res.data;
                })
            },
            toNotice() {
                // 群公告
                this.$router.push({
                    path: '/chat/notice/details',
                    query: {
                        groupDetails: this.groupDetails,
                        targetId: this.targetId,
                        type: this.$route.query.type,
                        timestamp: this.$route.query.timestamp

                    }
                });
            },
            setStatus() {
                // 设置群名称
                if (this.groupDetails.isManager) {
                    this.status = !this.status;
                }
            },
            getRroupMembers() {
                // 获取群成员
                groupMembers(this.targetId).then((res)=>{
                    for (let i=0;i<res.data.members.length;i++) {
                        this.member.push(res.data.members[i])
                    }
                    this.initLoading.hide();

                })
            },
            onMore() {
                // 查看更多成员
                this.$router.push({
                    path: '/chat/more/members',
                    query: {
                        name: this.groupName,
                        targetId: this.targetId,
                        type: this.type
                    }
                });
            },
            removeMessages() {
                // 删除聊天记录
                if(this.timestamp) {
                    let _this = this;

                    this.$dialog({
                        title: "确定删除聊天记录？",
                        content: "删除后将从你的聊天记录里消失，无法找回",
                        onOkBtn(){
                            let loading =  this.$toast.loading('删除中...',{
                                duration:0,
                                cover:false
                            });

                            rongClearRemoteHistoryMessages(_this.type, _this.targetId, _this.timestamp).then(()=>{
                                this.$toast.success('清除成功！');
                                this.close(); //关闭对话框
                                loading.hide();
                            }).catch(()=>{
                                this.close(); //关闭对话框
                                loading.hide();
                            });
                        }
                    });
                } else {
                    this.$dialog({
                        title: "提示",
                        content: "当前没有群信息",
                        cancelBtnTxt: '知道了',
                        noOkBtn: true
                    });
                }
            },
            editorName() {
                // 修改群名称
                if (this.value) {
                    let loading =  this.$toast.loading('修改中...',{
                        duration:0,
                        cover:false
                    });
                    let _this = this;
                    groupeditName(_this.targetId, _this.value).then(()=>{
                        this.$toast.success('发布成功！');
                        _this.getRroupInfo();
                        _this.status = false;
                        loading.hide();
                    }).catch(()=>{
                        loading.hide();
                    });
                } else {
                    this.$dialog({
                        title: "错误",
                        content: "不能为空",
                        cancelBtnTxt: '知道了',
                        noOkBtn: true
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
        .member-list {
            padding: 10px 0;
            display: grid;

            grid-template-columns: 20% 20% 20% 20% 20%;
        }
        .more {
            margin-top: 10px;
            text-align: center;
            &-text {
                font-size: 12px;
                color: #848484;
            }
        }
        .separate {
            height: 10px;
            background-color: rgb(242, 242, 242);
            margin: 10px -10px;
            margin-bottom: 0;
        }
        .remove-messages {
            padding: 10px 0;
            color: red;
            text-align: center;
            border-bottom: 1px solid rgba(218, 218, 218, 0.5);
        }
        .editor-dialog {
            top: 0;
            left: 0;
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99;
            .dialog-content {
                padding: 30px;
                background-color: #fff;
                border-radius: 6px;
                .title {
                    text-align: center;
                }
                .body {
                    margin: 20px 0;
                }
            }
        }

    }
</style>
