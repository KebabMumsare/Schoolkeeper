<template>
<NavBar site="admintools" :currentUser="currentUser" />

<main>
    <router-link 
      to="/addnewuser" 
    >
    </router-link>
</main>
</template>

<style>

</style>

<script>

import NavBar from '@/components/Nav-Bar.vue';
import { useStorage } from '@vueuse/core';

export default {
    components: {
        NavBar
    },
    data() {
        return {
            currentUser: useStorage('currentUser', {id: '', name: '', access: '', class: ''}),
        }
    },
}

</script>



