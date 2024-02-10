<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.ts';

const authStore = useAuthStore();
let response = ref('');

function whoamiCall() {
    authStore.whoamiActor?.whoami().then((res: any) => {
        response.value = res;
    });
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<template>
    <div class="container">
        <h1>Internet Identity Client</h1>
        <h2>You are authenticated!</h2>
        <p>To see how a canister views you, click this button!</p>
        <button id="whoamiButton" type="button" class="primary" @click="whoamiCall">Who am I?</button>
        <input id="whoami" type="text" readonly placeholder="your Identity" :value="response" />
        <button id="logout" @click="async () => await authStore.logout()">log out</button>
    </div>
</template>

<style scoped>
#whoami {
    border: 1px solid #1a1a1a;
    margin-bottom: 1rem;
}
</style>
