<script setup lang="ts">
import type { PropType } from 'vue';
import type { Header } from 'vue3-easy-data-table';

interface Document {
    id: string;
    sender: string;
    recievers: string[];
}

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'Sender', value: 'sender' },
    { text: 'Recievers', value: 'recievers' },
];

const props = defineProps({
    documents: {
        type: Array as PropType<Document[]>,
        required: true,
    },
});
</script>

<template>
    <div>
        <EasyDataTable table-class-name="customize-table" :headers="headers" :items="props.documents" />
    </div>
</template>
