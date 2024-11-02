<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/Nav-Bar.vue';
import Footer from '@/components/Footer.vue';
import { useStorage } from "@vueuse/core";

const currentUser = useStorage('currentUser', { name: '', access: '', class: '' });
</script>


<template>
    <head>
        <link rel="icon" href="/public/pictures/duck.jpg" type="image/x-icon"/>
    </head>
    <div id="app">
        <NavBar v-if="showNavBar" site="home" :currentUser="currentUser" />
        <router-view />
        <Footer />
    </div>
</template>
