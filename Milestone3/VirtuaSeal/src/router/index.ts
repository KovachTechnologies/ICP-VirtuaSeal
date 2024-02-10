import { createRouter, createWebHistory } from 'vue-router';

import MyDocuments from '../pages/MyDocuments.vue';
import MyTemplates from '../pages/MyTemplates.vue';
import RecentPage from '../pages/RecentPage.vue';
import SharedWithMe from '../pages/SharedWithMe.vue';
import StarredPage from '../pages/StarredPage.vue';
import ContactsPage from '../pages/ContactsPage.vue';

const routes = [
    {
        path: '/',
        name: 'My documents',
        component: MyDocuments,
    },
    {
        path: '/my-templates',
        name: 'My templates',
        component: MyTemplates,
    },
    {
        path: '/recent',
        name: 'Recent',
        component: RecentPage,
    },
    {
        path: '/shared',
        name: 'Shared with me',
        component: SharedWithMe,
    },
    {
        path: '/starred',
        name: 'Starred',
        component: StarredPage,
    },
    {
        path: '/contacts',
        name: 'Contacts',
        component: ContactsPage,
    },
];

const history = createWebHistory();

const router = createRouter({
    history,
    routes,
});

export default router;
