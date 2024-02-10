<script setup lang="ts">
import { useDocumentStore } from '../stores/document.ts';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { onMounted, onBeforeUnmount, ref, toRaw } from 'vue';
import UBtn from '../components/UBtn.vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

const documentStore = useDocumentStore();
const editor = ref();

const isOpen = ref(false);
function closeModal() {
    isOpen.value = false;
}
function openModal() {
    getCurrentDocument();
    fillSignatures();
    isOpen.value = true;
}

onMounted(async () => {
    getCurrentDocument();
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});

const getCurrentDocument = async () => {
    if (documentStore.currentDocument) {
        editor.value = new Editor({
            extensions: [StarterKit],
            content: toRaw(documentStore.currentDocument).content,
            editable: false,
        });
        editor.value.commands.setContent(toRaw(documentStore.currentDocument).content);
    }
};

const onSignDocument = async () => {
    const documentSignedResponse = await documentStore.onSignDocument();
    if (documentSignedResponse) {
        closeModal();
    }
};

const fillSignatures = async () => {
    if (documentStore.currentDocument.content === undefined) {
        return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(documentStore.currentDocument.content as string, 'text/html');

    const signatureObjects = documentStore.currentDocumentMetaData.signatures;

    signatureObjects?.forEach((signatureObject) => {
        const signatureMark = doc.querySelector(`[data-signature="${signatureObject.signature}"]`) as HTMLElement;
        signatureMark.innerHTML = signatureObject.signature;
    });

    editor.value?.commands.setContent(doc.body.innerHTML);
};
</script>

<template>
    <div>
        <u-btn prepend-icon="edit-04" block @click="openModal()">Sign document</u-btn>
        <TransitionRoot appear :show="isOpen" as="template">
            <Dialog as="div" class="relative z-50" @close="closeModal">
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-overlay !bg-opacity-70 backdrop-blur-lg" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel
                                :class="`
                  w-full max-w-4xl transform overflow-visible rounded-xl border border-primary
                  bg-white p-6 text-left align-middle shadow-xl transition-all
                `"
                            >
                                <DialogTitle as="h3" class="text-lg font-semibold leading-7 text-primary">
                                    Sign document
                                </DialogTitle>
                                <div v-if="editor" class="mt-5 mb-8">
                                    <editor-content class="document-render" :editor="editor" />
                                </div>

                                <div class="flex justify-end gap-x-3">
                                    <u-btn variant="outlined" color="gray" @click="closeModal()"> Cancel </u-btn>
                                    <u-btn
                                        prepend-icon="edit-04"
                                        :loading="documentStore.loadingDocumentState.sign"
                                        @click="onSignDocument"
                                    >
                                        Sign document
                                    </u-btn>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<style>
.document-render mark {
    background-color: transparent !important;
}
</style>
