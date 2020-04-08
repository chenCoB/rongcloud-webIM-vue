<template>
    <div class="user-avatar">
        <img class="avatar" :style="{width: avatar +'px'}" :src="info.portrait" alt="">
        <span class="name">{{info.name}}</span>
    </div>
</template>

<script>
    export default {
        name: "user-avatar",
        props: {
            avatarWidth: {
                default: 60,
                type: [String, Number]
            },
            info: {
                default: function () {
                    return {}
                },
                type: Object
            }
        },
        data() {
            return {
                avatar: this.avatarWidth
            }
        }
    }
</script>

<style scoped lang="scss">
.user-avatar {
    padding: 6px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .avatar {
        margin: 0 auto;
        display: block;
        border-radius: 50%;
    }
    .name {
        font-size: 12px;
        color: #848484;
    }
}
</style>
