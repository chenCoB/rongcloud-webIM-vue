<template>
    <div class="tabbar">
        <div class="tabbar-item" :class="[ active ? 'tabbar-item-active': '' ]" @click= onSwitch(true)>
            <span class="tabbar-item-text">消息</span>
        </div>
        <!--<div class="tabbar-item" :class="[ !active ? 'tabbar-item-active': '' ]" @click= onSwitch(false)>-->
            <!--<span class="tabbar-item-text">联系人</span>-->
        <!--</div>-->
        <div class="tabbar-item" :class="[ !active ? 'tabbar-item-active': '' ]" @click= onSwitch(false)>
            <span class="tabbar-item-text">我的</span>
        </div>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                active: true
            }
        },
        methods: {
            onSwitch(bol) {
                this.active = bol;
                bol ? this.$router.replace('/') : this.$router.replace('/user')
            },
            onRouter() {

                this.$route.name == 'home' ? this.active = true : this.active = false;
            }
        },
        watch: {
            $route() {
                this.onRouter();
            }
        }

    }
</script>

<style scoped lang="scss">
    .tabbar {
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        box-shadow: 0px -3px 12px rgba(123,130,132,0.16);
        height: 45px;
        align-items: center;
        box-sizing: border-box;
        display: flex;
        background: #fff;
        z-index: 999;
        .tabbar-item {
            flex: 1;
            text-align: center;
            .icon {
                font-size: 14px;
                color: $prompt-color;
            }
            .iconfont {
                font-size: 14px;
                color: $prompt-color;
            }
            .tabbar-item-text {
                display: block;
                font-size: 14px;
                color: $prompt-color;
            }
        }
        .tabbar-item-active {
            .icon {
                color: $theme-color

            }
            .tabbar-item-text {
                color: $theme-color
            }
        }
    }

</style>
