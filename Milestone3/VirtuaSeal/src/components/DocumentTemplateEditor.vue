<script setup lang="ts">
// import { useDocumentStore } from '../stores/document.ts';
import { useAuthStore } from '../stores/auth.ts';
import { Editor, EditorContent } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import HardBreak from '@tiptap/extension-hard-break';
import Text from '@tiptap/extension-text';
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue';
import UBtn from './UBtn.vue';
import UIcon from './UIcon.vue';
import { vMaska } from 'maska';
import type { Ref } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

// const documentStore = useDocumentStore();
const authStore = useAuthStore();

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const editor = ref<any>();
watch(
    () => editor.value?.getHTML(),
    (newHtml) => {
        emit('update:modelValue', newHtml);
    },
);

onMounted(() => {
    editor.value = new Editor({
        extensions: [Document, Text, Heading.configure({ levels: [1, 2, 3] }), HardBreak, Paragraph, Bold, Underline],
        content: props.modelValue,
        injectCSS: true,
    });
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});

// const showPopover = ref(false);
// const onOpenPopover = () => {
//     if (!showPopover.value) showPopover.value = true;
// };
// const onClosePopover = () => {
//     if (showPopover.value) showPopover.value = false;
// };
</script>

<template>
    <div v-if="editor">
        <div class="w-full">
            <div class="flex gap-4">
                <div class="w-full">
                    <label class="block text-sm font-medium text-secondary mb-1.5"> Template </label>
                    <div class="rounded-lg overflow-hidden border border-primary shadow-xs">
                        <div class="flex gap-2 border-b border-primary">
                            <div class="flex divide-x divide-gray-300">
                                <button
                                    class="editor-btn"
                                    :class="{
                                        'is-active': editor.isActive('heading', { level: 1 }),
                                    }"
                                    @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                                >
                                    <u-icon icon="heading-01" size="xs" class="text-primary" />
                                    <p class="text-black text-sm/4">1</p>
                                </button>
                                <button
                                    class="editor-btn"
                                    :class="{
                                        'is-active': editor.isActive('heading', { level: 2 }),
                                    }"
                                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                                >
                                    <u-icon icon="heading-01" size="xs" class="text-primary" />
                                    <p class="text-black text-sm/4">2</p>
                                </button>
                                <button
                                    class="editor-btn"
                                    :class="{
                                        'is-active': editor.isActive('heading', { level: 3 }),
                                    }"
                                    @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                                >
                                    <u-icon icon="heading-01" size="xs" class="text-primary" />
                                    <p class="text-black text-sm/4">3</p>
                                </button>
                                <button
                                    class="editor-btn"
                                    :class="{ 'is-active': editor.isActive('paragraph') }"
                                    @click="editor.commands.setParagraph()"
                                >
                                    <u-icon icon="type-01" size="xs" />
                                </button>
                                <button
                                    class="editor-btn"
                                    :class="{ 'is-active': editor.isActive('bold') }"
                                    @click="editor.chain().focus().toggleBold().run()"
                                >
                                    <u-icon icon="bold-01" size="xs" />
                                </button>
                                <button
                                    class="editor-btn !border-r border-gray-300"
                                    :class="{ 'is-active': editor.isActive('underline') }"
                                    @click="editor.chain().focus().toggleUnderline().run()"
                                >
                                    <u-icon icon="underline-01" size="xs" />
                                </button>
                            </div>
                        </div>
                        <div class="p-4">
                            <editor-content :editor="editor" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.ProseMirror-focused {
    outline: none;
}
</style>

<style scoped>
button.editor-btn {
    @apply flex items-center justify-center text-sm w-10 h-8;
}

button.editor-btn.is-active {
    @apply bg-gray-100;
}
</style>
