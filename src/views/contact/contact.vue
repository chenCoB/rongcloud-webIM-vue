<template>
    <div class="home">
        <nut-textinput
                v-model="val"
                label="群名："
                placeholder="请输入群名"
                :clearBtn="true"
                :disabled="false"
        />
        <nut-button
                @click="onCreate"
        >
            创建群
        </nut-button>




        <nut-textinput
                v-model="id"
                label="群id："
                placeholder="请输入id"
                :clearBtn="true"
                :disabled="false"
        />
        <nut-button
                @click="onAdd"
        >
            加入群
        </nut-button>
    </div>

</template>

<script>


export default {
        data() {
            return {
                val: '',
                id: ''
            }
        }
    }
</script>

<style scoped lang="scss">
    .home {
    }
</style>
