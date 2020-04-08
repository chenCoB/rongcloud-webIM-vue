<template>
    <div class="layout">
        <router-view></router-view>
        <Tabbar v-if="showTabbar"></Tabbar>
    </div>
</template>

<script>
    import Tabbar from '@/components/tabbar';
    export default {
        name: "layout",
        data() {
            return {
                showTabbar: true
            }
        },
        components: {
            Tabbar
        },
        watch: {
            $route() {
               this.onRoute(this.$route);
            }
        },
        mounted(){
            this.onRoute(this.$route);
        },
        methods: {
            onRoute(name) {
                if (name.name == 'home' || name.name == 'user')  {
                    this.showTabbar = true;
                } else {
                    this.showTabbar = false;
                }
            }
        }
    }
</script>

