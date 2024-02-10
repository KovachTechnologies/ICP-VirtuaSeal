<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth.ts';
// import { useDocumentStore } from '../stores/document.ts';
import { useTemplateStore } from '../stores/template.ts';
import type { Header, SortType } from 'vue3-easy-data-table';
// import CreateDocumentModal from '../components/CreateDocumentModal.vue';
import CreateTemplateModal from '../components/CreateTemplateModal.vue';
import UBtn from '../components/UBtn.vue';
import USpinner from '../components/USpinner.vue';

// const documentStore = useDocumentStore();
const templateStore = useTemplateStore();
const authStore = useAuthStore();

onMounted(async () => {
    if (authStore.isAuthenticated) {
        templateStore.onGetMyTemplates();
    }
});

const sortBy = 'id';
const sortType: SortType = 'asc';

const headers: Header[] = [
    { text: 'ID', value: 'id', sortable: true },
    { text: 'Description', value: 'description', sortable: true },
    { text: 'Sender', value: 'sender' },
    { text: 'Keywords', value: 'keywords' },
    { text: 'CC', value: 'copied' },
    { text: 'Private', value: 'private', sortable: true },
];

const onClickRow = async (row: any) => {
    templateStore.onGetSingleTemplate(row.id.toString());
};
</script>

<template>
    <div class="flex flex-col gap-y-8">
        <div class="border-b border-secondary pb-5">
            <h1 class="text-primary">My templates</h1>
        </div>
        <div>
            <div class="flex justify-between">
                <div>
                    <h2>All your templates</h2>
                    <p>Keep track of your created templates.</p>
                </div>
                <div class="flex gap-x-2">
                    <u-btn
                        variant="outlined"
                        color="gray"
                        icon="refresh-cw-05"
                        :loading="templateStore.loadingTemplateState.table"
                        @click="templateStore.onGetTemplates()"
                    />
                    <create-template-modal btn-variant="default" btn-color="brand" />
                </div>
            </div>
        </div>
        <EasyDataTable
            table-class-name="customize-table"
            :headers="headers"
            :items="templateStore.myTemplates"
            :loading="templateStore.loadingTemplateState.table"
            :sort-by="sortBy"
            :sort-type="sortType"
            @click-row="onClickRow"
        >
            <template #loading>
                <div class="flex flex-col gap-4 items-center justify-center text-center">
                    <u-spinner size="2xl" />
                    <p class="text-sm font-medium text-secondary">Loading templates...</p>
                </div>
            </template>
        </EasyDataTable>
    </div>
</template>

<style lang="scss">
.customize-table .header-text {
    @apply text-xs font-medium text-tertiary;
}

.customize-table {
    @apply rounded-lg overflow-hidden shadow-xs;
    --easy-table-border: 1px solid #eaecf0;
    --easy-table-row-border: 1px solid #eaecf0;

    // --easy-table-header-font-size: 14px;
    // --easy-table-header-height: 50px;
    // --easy-table-header-font-color: #c1cad4;
    --easy-table-header-background-color: #f9fafb;

    // --easy-table-header-item-padding: 10px 15px;

    // --easy-table-body-even-row-font-color: #fff;
    // --easy-table-body-even-row-background-color: #4c5d7a;

    // --easy-table-body-row-font-color: #c0c7d2;
    // --easy-table-body-row-background-color: #2d3a4f;
    // --easy-table-body-row-height: 50px;
    // --easy-table-body-row-font-size: 14px;

    // --easy-table-body-row-hover-font-color: #2d3a4f;
    --easy-table-body-row-hover-background-color: #f9fafb;

    // --easy-table-body-item-padding: 10px 15px;

    // --easy-table-footer-background-color: #2d3a4f;
    // --easy-table-footer-font-color: #c0c7d2;
    // --easy-table-footer-font-size: 14px;
    // --easy-table-footer-padding: 0px 10px;
    // --easy-table-footer-height: 50px;

    // --easy-table-rows-per-page-selector-width: 70px;
    // --easy-table-rows-per-page-selector-option-padding: 10px;
    // --easy-table-rows-per-page-selector-z-index: 1;

    // --easy-table-scrollbar-track-color: #2d3a4f;
    // --easy-table-scrollbar-color: #2d3a4f;
    // --easy-table-scrollbar-thumb-color: #4c5d7a;
    // --easy-table-scrollbar-corner-color: #2d3a4f;

    // --easy-table-loading-mask-background-color: #2d3a4f;

    .vue3-easy-data-table__body {
        @apply cursor-pointer;
    }
}
</style>
