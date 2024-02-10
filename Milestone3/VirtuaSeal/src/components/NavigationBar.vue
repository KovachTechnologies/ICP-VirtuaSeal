<script setup lang="ts">
import UIcon from './UIcon.vue';
import InternetIdentityLogin from './InternetIdentityLogin.vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navigation = [
    { name: 'My documents', href: '/', icon: 'folder' },
    { name: 'My templates', href: '/my-templates', icon: 'file-02' },
    // { name: 'Shared with me', href: '/shared', icon: 'share-07' },
    // { name: 'Starred', href: '/starred', icon: 'star-01' },
    // { name: 'Contacts', href: '/contacts', icon: 'user-01' },
];

const sidebarOpen = ref(false);
</script>

<template>
    <div>
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
                <TransitionChild
                    as="template"
                    enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-gray-950/80" />
                </TransitionChild>

                <div class="fixed inset-0 flex">
                    <TransitionChild
                        as="template"
                        enter="transition ease-in-out duration-300 transform"
                        enter-from="-translate-x-full"
                        enter-to="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leave-from="translate-x-0"
                        leave-to="-translate-x-full"
                    >
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <TransitionChild
                                as="template"
                                enter="ease-in-out duration-300"
                                enter-from="opacity-0"
                                enter-to="opacity-100"
                                leave="ease-in-out duration-300"
                                leave-from="opacity-100"
                                leave-to="opacity-0"
                            >
                                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <u-icon icon="x-close" size="sm" class="text-white" />
                                    </button>
                                </div>
                            </TransitionChild>

                            <div
                                class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-950 px-6 pb-2 ring-1 ring-white/10"
                            >
                                <div class="flex h-16 shrink-0 items-center">
                                    <img class="h-10 w-auto" src="../assets/UInified-logo-dark.svg" alt="UInified" />
                                </div>
                                <nav class="flex flex-1 flex-col">
                                    <ul role="list" class="-mx-2 flex-1 space-y-1">
                                        <li v-for="item in navigation" :key="item.name">
                                            <RouterLink
                                                :to="item.href"
                                                :class="[
                                                    item.name === route.name
                                                        ? 'bg-gray-800 text-white'
                                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                                                    'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6',
                                                ]"
                                            >
                                                <u-icon :icon="item.icon" size="sm" class="my-auto" />
                                                {{ item.name }}
                                            </RouterLink>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div
            class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-20 lg:overflow-y-auto bg-gray-950 lg:pb-4 lg:flex-col"
        >
            <div class="flex h-16 shrink-0 items-center justify-center">
                <img class="h-10 w-auto" src="../assets/UInified-icon-tight.svg" alt="UInified" />
            </div>
            <nav class="mt-4 flex-grow">
                <ul role="list" class="flex flex-col items-center space-y-1">
                    <li v-for="item in navigation" :key="item.name">
                        <RouterLink
                            :to="item.href"
                            :class="[
                                item.name === route.name
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold',
                            ]"
                        >
                            <u-icon :icon="item.icon" size="md" aria-hidden="true" />
                            <span class="sr-only">{{ item.name }}</span>
                        </RouterLink>
                    </li>
                </ul>
            </nav>
            <div class="relative flex flex-col items-center space-y-1">
                <InternetIdentityLogin />
            </div>
        </div>

        <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-950 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
            <button type="button" class="-m-2.5 p-2.5 text-gray-300 lg:hidden" @click="sidebarOpen = true">
                <span class="sr-only">Open sidebar</span>
                <u-icon icon="menu-01" size="sm" aria-hidden="true" />
            </button>
            <div class="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
            <!-- <a href="#">
                <span class="sr-only">Your profile</span>
                <img
                    class="h-8 w-8 rounded-full bg-gray-800"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                />
            </a> -->
        </div>
    </div>
</template>
