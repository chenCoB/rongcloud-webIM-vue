<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    export default  {
        created() {
            this.$store.dispatch('onUser');
        }
    }
</script>
<style>
    body {
        margin: 0;
        position: relative;
    }
</style>
