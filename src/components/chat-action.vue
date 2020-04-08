<template>
    <div class="chat-action">
        <span class="action" @click="onRecallMessage">撤回</span>
    </div>
</template>

<script>
    import {rongRecallMessage} from "../libs/rongcloud/rongcloud-messages";

    export default {
        name: "chat-action",
        props: {
            recallMessage: {
                default: function () {
                    return {}
                },
                type: Object
            }
        },
        methods: {
            onRecallMessage() {
                // 撤回消息
                console.log(this.recallMessage, '撤回的')
                rongRecallMessage(this.recallMessage).then(()=>{
                     this.$emit('recallSucceed', this.recallMessage.messageId)
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .chat-action {
        min-width: 40px;
        background-color: #fff;
        border: 1px solid rgba(0,0,0,0.2);
        border-radius: 4px;
        .action {
            text-align: center;
            padding: 4px 6px;
            display: block;
            font-size: 12px;
            border-bottom: 1px solid rgba(0,0,0,0.2);
            &:last-child {
                border-bottom: 0;
            }
        }
    }
</style>
