<template>
    <div class="layout">
        <nut-textinput
                v-model="formInline.name"
                label="用户名："
                placeholder="请输入用户名"
                :clearBtn="true"
                :disabled="false"
        />
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
                    @click="onRegister"
            >
                注册
            </nut-button>
            <router-link to="/login"  style="color: #999999">
                <nut-button type="light">登录</nut-button>
            </router-link>
        </div>

    </div>

</template>

<script>
    import {register} from "../../api/user";
    export default {
        name: "register",

        data(){
            return {
                formInline: {
                    name: '',
                    email: '',
                    password: '',
                }
            }
        },
        methods: {
            onRegister() {
                if (this.formInline.name.match(/^[ ]*$/)) {
                    this.$dialog({
                        title: "错误",
                        content: "用户名不能为空",
                        cancelBtnTxt: '知道了',
                        noOkBtn: true
                    });
                    return false;
                }
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

                let loading =  this.$toast.loading('正在注册...',{
                    duration:0,
                    cover:false
                });
                register(this.formInline).then(()=>{
                    loading.hide();
                    this.$toast.success('注册成功！');
                    this.$router.push('/login');

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

