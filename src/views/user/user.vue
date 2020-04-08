<template>
    <div class="user">

        <div>
            <nut-textinput type="text" v-model="form.id" placeholder="接受人的id"></nut-textinput>
            <nut-textinput type="text" v-model="form.name" placeholder="接受人的名字"></nut-textinput>
            <nut-textinput v-model="content" placeholder="发送的信息"></nut-textinput>
            <nut-textinput v-model="type" placeholder="请输入类型：1单聊·3群聊"></nut-textinput>
            <div class="btn-footer">
            <nut-button @click="onSend">发送</nut-button>
            <nut-button type="light" @click="onLogout">退出登录</nut-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {rongSendText} from "../../libs/rongcloud/rongcloud-messages";
    import {logout} from "../../api/user";
    import {mapState} from 'vuex'
    export default {
        name: "user",
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    portrait: 'http://7xogjk.com1.z0.glb.clouddn.com/IuDkFprSQ1493563384017406982'
                },
                messages: [],
                id: '',
                content: '',
                type: ''
            }
        },
        computed: {
            ...mapState(['userModel']),

        },
        methods: {
            onLogout() {
                let loading =  this.$toast.loading('正在退出...',{
                    duration:0,
                    cover:false
                });

                logout().then(()=>{
                   // RongIMClient.getInstance().logout();
                    this.$store.commit('setStatus', false);
                    localStorage.removeItem('imToken');
                    localStorage.removeItem('rongToken');
                    this.$router.push('/login');
                    window.location.reload()
                    loading.hide();
                }).catch(()=>{
                    loading.hide();
                })
            },
            onSend() {
                // 融云发送聊天
                if (this.content) {
                    let c ;
                    if (this.type == 3) {
                        c = 'GROUP'
                    } else if (this.type == 1){
                        c = 'PRIVATE'
                    } else {
                        alert('类型错误')
                        return false
                    }
                    rongSendText(this.form.id,c,this.content,{
                        sender: this.userModel.user,
                        target: this.form
                    }).then((message)=>{

                        this.content = '';
                        message.action = false;
                        this.messages.push(message);
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
        }
    }
</script>

<style scoped lang="scss">
.user {
    padding: 10px;
    .btn-footer {
        margin-top: 10px;
    }
}
</style>
