<script setup lang="ts">
import { useTemplateStore } from '../stores/template.ts';
import { useDocumentStore } from '../stores/document.ts';
import VuePdfEmbed from 'vue-pdf-embed';
import ExamplePdf from '../assets/Basic-Non-Disclosure-Agreement.pdf';
import StarterKit from '@tiptap/starter-kit';
import { useElementSize } from '@vueuse/core';
import { onMounted, ref, watch, toRaw } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';

const documentStore = useDocumentStore();
const templateStore = useTemplateStore();

const editor = ref<any>();

const a4ContainerRef = ref();
const { width, height } = useElementSize(a4ContainerRef);

onMounted(() => {
    editor.value = new Editor({
        extensions: [StarterKit],
        content: documentStore.currentDocument?.content,
        // content: toRaw(fillSignatures(documentStore.currentDocument?.content)),
        injectCSS: true,
    });
    scaleTemplatePreview();
    // console.log();
});

// watch(editor.value, () => {
//     // log
//     scaleTemplatePreview();
//     editor.value?.commands.setContent(documentStore.currentDocument?.content || '');
// });

watch(documentStore, () => {
    scaleTemplatePreview();
    editor.value?.commands.setContent(documentStore.currentDocument?.content || '');

    // const newContent = fillSignatures(documentStore.currentDocument?.content);
    // console.log(newContent);
    // editor.value?.commands.setContent(newContent);
});
const scaleTemplatePreview = () => {
    const a4 = document.querySelector('.a4');
    if (!a4) return;
    const updateScale = () => {
        const scaleFactor = width.value / 672;
        document.querySelector('.a4').style.transform = `scale(${scaleFactor})`;
    };

    updateScale(); // Initial scale update
    window.addEventListener('resize', updateScale); // Update scale on window resize
};

const fillSignatures = (content: string) => {
    // if (documentStore.currentDocument.content === undefined) {
    //     return;
    // }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content as string, 'text/html');

    const signatureObjects = documentStore.currentDocumentMetaData.signatures;

    // console.log(signatureObjects);

    signatureObjects?.forEach((signatureObject) => {
        const signatureMark = doc.querySelector(`[data-signature="${signatureObject.signature}"]`) as HTMLElement;
        signatureMark.innerHTML = signatureObject.signature;
    });

    return doc.body.innerHTML;

    // editor.value?.commands.setContent(doc.body.innerHTML);
};
// import UBtn from './UBtn.vue';
</script>

<template>
    <div>
        <div
            ref="a4ContainerRef"
            class="pdf-preview--container w-full h-96 overflow-hidden rounded-lg flex items-center justify-center border border-secondary"
        >
            <div class="pointer-events-none flex w-full h-full relative">
                <div class="a4 absolute top-0 bg-white">
                    <div v-html="documentStore.currentDocument?.content" />
                </div>
            </div>
            <!-- <div v-if="documentStore.currentDocument" class="pointer-events-none"> -->
            <!-- <div class="pointer-events-none">
                <vue-pdf-embed :source="ExamplePdf" :page="1" />
            </div> -->
            <!-- <u-btn
                color="gray"
                variant="outlined"
                icon="search-lg"
                size="xl"
                class="!absolute !rounded-full !bg-black/50 backdrop-blur-lg !text-white !ring-white/60"
            ></u-btn> -->
        </div>
    </div>
</template>

<style>
.pdf-preview--container {
    background-color: #666666;
    opacity: 0.8;
    background-image: repeating-linear-gradient(
            45deg,
            #4c4c4c 25%,
            transparent 25%,
            transparent 75%,
            #4c4c4c 75%,
            #4c4c4c
        ),
        repeating-linear-gradient(45deg, #4c4c4c 25%, #666666 25%, #666666 75%, #4c4c4c 75%, #4c4c4c);
    background-position:
        0 0,
        15px 15px;
    background-size: 30px 30px;
}

.pdf-preview--container mark {
    background-color: white !important;
}
</style>
