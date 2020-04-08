<template>
    <div class="notice-details">
        <div class="chat-header">
            <nut-navbar
                    :rightShow="false"
                    @on-click-back="back"
            >
                群公告
            </nut-navbar>
        </div>
        <div class="group-name-wrap">
            <img class="group-avatar" src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="">
            <div class="group-name">
                <span class="name">{{groupDetails.groupName}}</span>
                <!--<i class="date">2020-03-24 08:21</i>-->
            </div>
        </div>
        <div class="notice-text">
            <template  v-if="groupDetails.isManager">
                <nut-textbox
                        v-if="editor"

                        @inputFunc="inputText"
                        placeText="群公告内容数字限制300字符"
                        :maxNum="300">
                </nut-textbox>
                <div class="details" v-else>
                    {{groupDetails.announcement ? groupDetails.announcement : '~当前没有群公告'}}
                </div>
            </template>
            <div class="details" v-else>
                {{groupDetails.announcement ? groupDetails.announcement : '~当前没有群公告'}}
            </div>
        </div>
        <template  v-if="groupDetails.isManager">
            <nut-button block @click="editor = !editor" v-if="!editor">编辑</nut-button>
            <nut-button block @click="onRelease" v-else>完成</nut-button>
        </template>


    </div>
</template>

<script>
    import {groupeditAnno} from "../../api/group";

    export default {
        name: "notice-details",
        data() {
            return {
                editor: false,
                text: '',
                targetId: '',
                groupDetails: '',
                timestamp: '', //收到的时间
                type: ''
            }
        },
        created() {

            this.groupDetails = this.$route.query.groupDetails;
            this.targetId = this.$route.query.targetId;
            this.type = this.$route.query.type;
            this.timestamp = this.$route.query.timestamp
        },
        methods: {
            back() {
                // 群详情
                this.$router.push({
                    path: '/chat/group/details',
                    query: {
                        name: this.groupName,
                        type: this.type,
                        timestamp: this.timestamp,
                        targetId: this.targetId
                    }
                });
            },
            inputText(text) {
                this.text = text;
            },
            onRelease (){

                if (this.text){
                    let _this = this;
                    this.$dialog({
                        title: "发布公告",
                        content: "该公告会通知全部群成员，是否发布？",
                        onOkBtn(){
                            let loading =  this.$toast.loading('发布中...',{
                                duration:0,
                                cover:false
                            });

                            groupeditAnno(_this.targetId, _this.text).then(()=>{
                                this.$toast.success('发布成功！');
                                _this.$router.push({
                                    path: '/chat/group/details',
                                    query: {
                                        name: _this.groupName,
                                        targetId: _this.targetId,
                                        timestamp: _this.timestamp,
                                        type: _this.type
                                    }
                                });
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
                        title: "错误",
                        content: "不能为空",
                        cancelBtnTxt: '知道了',
                        noOkBtn: true
                    });
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    .notice-details {
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
        .group-name-wrap {
            padding-top: 20px;
            display: flex;
            align-items: center;
            .group-avatar {
                flex: 0 0 40px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
            .group-name {
                padding-left: 10px;
                .name {
                    display: block;
                    word-wrap:break-word
                }
                .date {
                    display: block;
                    font-style: normal;
                    font-size: 12px;
                    color: rgba(0,0,0,0.3);
                }
            }
        }
        .details {
            word-wrap:break-word;
            border-radius: 4px;
            font-size: 14px;
            line-height: 20px;
            border: 1px solid rgb(244, 244, 244);
            background-color: rgb(244, 244, 244);
            padding: 16px;
        }
        .notice-text {
            margin: 20px 0;
        }

    }
</style>
