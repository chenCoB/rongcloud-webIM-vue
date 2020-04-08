<template>
    <div class="chat">
        <div class="chat-header">
            <nut-navbar
                    :rightShow="false"
                    @on-click-back="back"
                    @on-click-title="title"
            >
                {{title}}({{member.length}}人)
            </nut-navbar>
        </div>
        <div class="member-list">
            <UserAvatar avatar-width="45"  v-for="(val,index) in member" :key="index" :info="val"></UserAvatar>
        </div>
    </div>
</template>

<script>
    import UserAvatar from "../../components/user-avatar";
    import {groupMembers} from "../../api/group";
    export default {
        name: "more-members",
        components: {UserAvatar},
        data() {
            return {
                targetId: '',
                title: '群成员',
                type: '',
                value: '',
                member: []

            }
        },
        created() {
            this.type = this.$route.query.type;

            this.targetId = this.$route.query.targetId;
            this.getRroupMembers();
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            getRroupMembers() {
                // 获取群成员
                groupMembers(this.targetId).then((res)=>{
                    for (let i=0;i<res.data.members.length;i++) {
                        this.member.push(res.data.members[i])
                    }

                })
            },
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

    }
</style>
