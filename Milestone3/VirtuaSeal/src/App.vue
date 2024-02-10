<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue';
import PdfSideBar from './components/PdfSideBar.vue';
import TemplateSidebar from './components/TemplateSidebar.vue';
import LoggedOut from './components/LoggedOut.vue';
import { useDocumentStore } from './stores/document.ts';
import { storeToRefs } from 'pinia';
import { useAuthStore } from './stores/auth.ts';
import { toRaw } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const documentStore = useDocumentStore();
const authStore = useAuthStore();
const { isReady, isAuthenticated } = storeToRefs(authStore);
if (isReady.value === false) {
    authStore.init();
}
</script>

<template>
    <main>
        <div v-if="isReady">
            <div
                v-if="isAuthenticated"
                :class="
                    Object.values(documentStore.loadingDocumentState).indexOf(true) > -1
                        ? '!cursor-progress'
                        : 'cursor-auto'
                "
            >
                <NavigationBar />
                <main class="lg:pl-20 min-h-screen">
                    <div class="xl:pr-96">
                        <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                            <router-view></router-view>
                        </div>
                    </div>
                </main>

                <aside
                    class="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 bg-white px-6 py-8 xl:block"
                >
                    <PdfSideBar v-if="toRaw(route).name === 'My documents'" />
                    <TemplateSidebar v-else />
                </aside>
            </div>
            <!-- <LoggedIn v-if="isAuthenticated" /> -->
            <LoggedOut v-else />
        </div>
    </main>
</template>
