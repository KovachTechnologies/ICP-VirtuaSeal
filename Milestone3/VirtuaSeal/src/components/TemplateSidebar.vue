<script setup lang="ts">
import { useTemplateStore } from '../stores/template.ts';
import { onMounted, ref, watch } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import EditTemplateModal from './EditTemplateModal.vue';
// import VuePdfEmbed from 'vue-pdf-embed';
import StarterKit from '@tiptap/starter-kit';
// import PdfViewer from './PdfViewer.vue';
import USpinner from './USpinner.vue';
import { useElementSize } from '@vueuse/core';
// import * as pdfjsLib from 'pdfjs-dist';
// import ExamplePdf from '../assets/Basic-Non-Disclosure-Agreement.pdf';
// import SignDocumentModal from './SignDocumentModal.vue';
// import ViewDocumentModal from './ViewDocumentModal.vue';

const templateStore = useTemplateStore();

const editor = ref<any>();

const a4ContainerRef = ref();
const { width, height } = useElementSize(a4ContainerRef);

onMounted(() => {
    editor.value = new Editor({
        extensions: [StarterKit],
        content: templateStore.currentTemplate?.content,
        injectCSS: true,
    });
    scaleTemplatePreview();
});

watch(templateStore, () => {
    console.log('update');

    editor.value?.commands.setContent(templateStore.currentTemplate?.content || '');
    setTimeout(() => {
        scaleTemplatePreview();
    }, 1);
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
</script>

<template>
    <div class="h-full">
        <div
            v-if="templateStore.currentTemplate || templateStore.loadingTemplateState.sidebar"
            class="flex flex-col gap-6"
        >
            <div class="flex items-center gap-x-3 pb-5 border-b border-gray-200">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.75 4C4.75 2.20508 6.20508 0.75 8 0.75H24C24.1212 0.75 24.2375 0.798159 24.3232 0.883885L35.1161 11.6768C35.2018 11.7625 35.25 11.8788 35.25 12V36C35.25 37.7949 33.7949 39.25 32 39.25H8C6.20507 39.25 4.75 37.7949 4.75 36V4Z"
                        fill="white"
                        stroke="#D0D5DD"
                        stroke-width="1.5"
                    />
                    <path d="M24 0.5V8C24 10.2091 25.7909 12 28 12H35.5" stroke="#D0D5DD" stroke-width="1.5" />
                </svg>

                <h2 class="text-lg font-semibold text-gray-900">Template preview</h2>
            </div>
            <div class="flex flex-col gap-6">
                <div
                    ref="a4ContainerRef"
                    class="template-preview--container w-full h-96 overflow-hidden rounded-lg flex items-center justify-center border border-secondary"
                >
                    <div class="pointer-events-none flex w-full h-full relative">
                        <div class="a4 absolute top-0 bg-white">
                            <div v-html="templateStore.currentTemplate?.content" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-xl font-semibold text-gray-900">
                        {{ templateStore.currentTemplate?.description }}
                    </h3>
                    <div class="w-full flex gap-2 mt-4">
                        <span
                            v-for="(keyword, index) in templateStore.currentTemplate.keywords"
                            :key="index"
                            class="text-xs font-normal text-gray-700 py-0.5 px-1.5 rounded-md border border-gray-300"
                        >
                            {{ keyword }}
                        </span>
                    </div>
                    <!-- <p class="w-full text-sm font-normal text-gray-600"> -->
                    <!-- </p> -->
                </div>
                <div class="pt-6 border-t border-gray-200">
                    <h3 class="text-md font-semibold text-gray-900 mb-3">Template details</h3>
                    <div>
                        <div class="flex mb-2">
                            <h4 class="w-full text-sm font-medium text-gray-700">Author</h4>
                            <p class="w-full text-sm font-normal text-gray-600 truncate">
                                {{ templateStore.currentTemplate?.sender.toText() }}
                            </p>
                        </div>
                        <div class="flex mb-2">
                            <h4 class="w-full text-sm font-medium text-gray-700">Copied</h4>
                            <div v-for="(cc, index) in templateStore.currentTemplate.copied" :key="index"></div>
                            <p class="w-full text-sm font-normal text-gray-600 truncate">
                                {{ templateStore.currentTemplate?.private }}
                            </p>
                        </div>
                        <div class="flex mb-2">
                            <h4 class="w-full text-sm font-medium text-gray-700">Private</h4>
                            <p class="w-full text-sm font-normal text-gray-600 truncate">
                                {{ templateStore.currentTemplate?.private }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="w-full pt-6 border-t border-gray-200 flex justify-between">
                    <EditTemplateModal class="w-full" />
                </div>
            </div>
        </div>
        <div v-else class="flex flex-col gap-5 justify-center items-center h-full text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.75 4C4.75 2.20508 6.20508 0.75 8 0.75H24C24.1212 0.75 24.2375 0.798159 24.3232 0.883885L35.1161 11.6768C35.2018 11.7625 35.25 11.8788 35.25 12V36C35.25 37.7949 33.7949 39.25 32 39.25H8C6.20507 39.25 4.75 37.7949 4.75 36V4Z"
                    fill="white"
                    stroke="#D0D5DD"
                    stroke-width="1.5"
                />
                <path d="M24 0.5V8C24 10.2091 25.7909 12 28 12H35.5" stroke="#D0D5DD" stroke-width="1.5" />
            </svg>
            <div class="gap-2">
                <h2 class="text-lg font-semibold text-primary">No template selected</h2>
                <p>You have not yet selected a template. Please do so by clicking on a template in the table</p>
            </div>
        </div>
        <div
            v-if="templateStore.loadingTemplateState.sidebar"
            class="w-full h-full absolute top-0 right-0 flex flex-col gap-4 items-center justify-center bg-white"
        >
            <u-spinner size="2xl" />
            <p class="text-sm font-medium text-secondary">
                {{
                    templateStore.loadingTemplateState.sidebar
                        ? 'Loading template...'
                        : templateStore.loadingTemplateState.update
                        ? 'Updating document...'
                        : ''
                }}
            </p>
        </div>
    </div>
</template>

<style>
.template-preview--container {
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

.a4 {
    transform-origin: top left; /* Set the origin of transformation */
    padding: 27mm 16mm 27mm 16mm;
    min-width: 672px;
    min-height: 888px;
    /* aspect-ratio: 28 / 37;
    height: 100%;
    max-width: 672px;
    max-height: 888px;
    margin: 27mm 16mm 27mm 16mm; */
}

.a4-nested {
    padding: 27mm 16mm 27mm 16mm;
}
</style>
