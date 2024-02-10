<script setup lang="ts">
import { useAuthStore } from '../stores/auth.ts';
import UBtn from './UBtn.vue';

const authStore = useAuthStore();
</script>

<template>
    <div class="container min-h-screen mx-auto flex flex-col items-center justify-center gap-8">
        <div class="flex flex-col items-center gap-6">
            <img class="h-12" src="../assets/UInified-icon-tight.svg" alt="UInified" />
            <div class="text-center gap-3">
                <h1 class="text-2xl font-semibold text-primary">VirtuaNotary</h1>
                <p class="text-base font-normal text-tertiary">You are not authenticated.</p>
            </div>
        </div>
        <u-btn @click="authStore.login()">Login</u-btn>
    </div>
</template>
