<template>
    <div>
        <NavBar/>
    </div>
    <div>
        <h1>AAAAAA</h1>
    </div>
</template>

<style scoped>
h1 {
    size: 1000px;
    color: black;
}
</style>

<script>
import NavBar from "@/components/Nav-Bar.vue";

export default {
    name: 'Personal',
    components: {
        NavBar,
    }
}
</script>
