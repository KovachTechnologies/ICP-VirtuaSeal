import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './index.css';
import App from './App.vue';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import { Icon, disableCache, addIcon } from '@iconify/vue';
import {
    uilFolder,
    uilTrash03,
    uilStar01,
    uilShare07,
    uilClock,
    uilXClose,
    uilMenu01,
    uilSearchLg,
    uilEdit04,
    uilDownloadCloud02,
    uilLinkExternal02,
    uilFileCheck02,
    uilUser01,
    uilLogOut01,
    uilPlus,
    uilHeading01,
    uilUnderline01,
    uilBold01,
    uilType01,
    uilTextInput,
    uilHelpCircle,
    uilRefreshCw05,
    uilEye,
    uilChevronSelectorVertical,
    uilCheck,
    uilFile02,
} from '@uinified/icons/line-icons';
import router from './router/index.ts';

import 'vue3-easy-data-table/dist/style.css';

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);

app.component('EasyDataTable', Vue3EasyDataTable);
app.component('Icon', Icon);

// addIcon("@uinified:line:placeholder", uilPlaceholder);
addIcon('@uinified:line:folder', uilFolder);
addIcon('@uinified:line:trash-03', uilTrash03);
addIcon('@uinified:line:star-01', uilStar01);
addIcon('@uinified:line:share-07', uilShare07);
addIcon('@uinified:line:clock', uilClock);
addIcon('@uinified:line:x-close', uilXClose);
addIcon('@uinified:line:menu-01', uilMenu01);
addIcon('@uinified:line:search-lg', uilSearchLg);
// addIcon('@uinified:file:simple-pdf', uifSimplePdf);
addIcon('@uinified:line:edit-04', uilEdit04);
addIcon('@uinified:line:download-cloud-02', uilDownloadCloud02);
addIcon('@uinified:line:link-external-02', uilLinkExternal02);
addIcon('@uinified:line:file-check-02', uilFileCheck02);
addIcon('@uinified:line:user-01', uilUser01);
addIcon('@uinified:line:log-out-01', uilLogOut01);
addIcon('@uinified:line:plus', uilPlus);
addIcon('@uinified:line:heading-01', uilHeading01);
addIcon('@uinified:line:underline-01', uilUnderline01);
addIcon('@uinified:line:bold-01', uilBold01);
addIcon('@uinified:line:type-01', uilType01);
addIcon('@uinified:line:text-input', uilTextInput);
addIcon('@uinified:line:help-circle', uilHelpCircle);
addIcon('@uinified:line:refresh-cw-05', uilRefreshCw05);
addIcon('@uinified:line:eye', uilEye);
addIcon('@uinified:line:chevron-selector-vertical', uilChevronSelectorVertical);
addIcon('@uinified:line:check', uilCheck);
addIcon('@uinified:line:file-02', uilFile02);
disableCache('all');

app.mount('#app');
