<template>
  <NavBar site="notice" :currentUser="currentUser" />
  <div>
    
  </div>
</template>

<style scoped>

</style>

<script>
import NavBar from '@/components/Nav-Bar.vue';
import { useStorage } from "@vueuse/core";

export default {
  name: 'notice',
  components: {
    NavBar,
  },
  data() {
    return {
      currentUser: useStorage('currentUser', { name: '', access: '', class: '' }),
    };
  }
};
</script>



