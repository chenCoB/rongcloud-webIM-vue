<template>
    <div class="layout">
        <nut-textinput
                v-model="formInline.email"
                label="邮箱："
                placeholder="请输入邮箱"
                :clearBtn="true"
                :disabled="false"
        />
        <nut-textinput
                placeholder="请输入密码"
                v-model="formInline.password"
                label="密码："
                type="password"
        />
        <div class="btn">
            <nut-button
                    @click="onLogin"
            >
                登录
            </nut-button>
            <router-link to="/register" style="color: #999999">
                <nut-button type="light">注册</nut-button>
            </router-link>
        </div>

    </div>

</template>

<script>
    import {login} from "@/api/user";
    export default {
        name: "login",

        data(){
            return {
                loading: false,
                appkey: 'vnroth0kvlo1o',
                formInline: {
                    email: '',
                    password: '',
                }
            }
        },
        methods: {
            onLogin() {
                if (this.formInline.email.match(/^[ ]*$/)) {
                    this.$dialog({
                        title: "错误",
                        content: "邮箱不能为空",
                        cancelBtnTxt: '知道了',
                        noOkBtn: true
                    });
                    return false;
                }
                if (this.formInline.password.match(/^[ ]*$/)) {
                    this.$dialog({
                        title: "错误",
                        content: "密码不能为空",
                        cancelBtnTxt: '知道了',
                        noOkBtn: true
                    });
                    return false;
                }

                let loading =  this.$toast.loading('登录中...',{
                    duration:0,
                    cover:false
                });
                login(this.formInline).then((res)=>{
                    localStorage.removeItem('imToken');
                    localStorage.setItem('imToken', res.data.access_token);
                    localStorage.removeItem('rongToken');
                    this.$store.dispatch('onUser');
                    loading.hide();
                    this.$router.push('/')
                }).catch(()=>{
                    loading.hide();
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .layout {
        padding: 20px;
        .btn {
            margin-top: 10px;
            text-align: center;
        }
    }
</style>
