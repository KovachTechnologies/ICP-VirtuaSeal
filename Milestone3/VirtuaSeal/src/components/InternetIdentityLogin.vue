<script setup lang="ts">
import UIcon from './UIcon.vue';
import { useAuthStore } from '../stores/auth.ts';

const authStore = useAuthStore();
</script>

<template>
    <button
        title="Log out"
        class="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
        @click="async () => await authStore.logout()"
    >
        <u-icon icon="log-out-01" class="" />
    </button>
</template>
