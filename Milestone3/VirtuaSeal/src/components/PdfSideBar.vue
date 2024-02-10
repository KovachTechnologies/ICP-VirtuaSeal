<script setup lang="ts">
import { useDocumentStore } from '../stores/document.ts';
import * as pdfjsLib from 'pdfjs-dist';
import ExamplePdf from '../assets/Basic-Non-Disclosure-Agreement.pdf';
import PdfViewer from './PdfViewer.vue';
import USpinner from './USpinner.vue';
import { onMounted, ref } from 'vue';
import SignDocumentModal from './SignDocumentModal.vue';
import ViewDocumentModal from './ViewDocumentModal.vue';

const documentStore = useDocumentStore();

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const pdfDocument: any = ref<any>(null);
const pdfMetadata: any = ref<any>(null);
const pdfInfo: any = ref<any>(null);

const getPdfDocument = async (src: any) => {
    const doc = await pdfjsLib.getDocument(src).promise;
    pdfMetadata.value = await doc.getMetadata();
    pdfInfo.value = pdfMetadata.value.info;
    return doc;
};

onMounted(async () => {
    pdfDocument.value = await getPdfDocument(ExamplePdf);
});

const formatDate = (creationDateBigInt: bigint): string => {
    // Convert nanoseconds to milliseconds
    const milliseconds = Number(creationDateBigInt / BigInt(1000000));

    // Create a new Date object
    const date = new Date(milliseconds);

    // Array of month names for formatting
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    // Format the date
    return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
};
</script>

<template>
    <div class="h-full">
        <div
            v-if="documentStore.currentDocument || documentStore.loadingDocumentState.sidebar"
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
                    <path
                        d="M25.7088 25.344C24.586 25.344 23.1808 25.5399 22.7211 25.6088C20.8184 23.6218 20.277 22.4924 20.1553 22.1913C20.3203 21.7673 20.8944 20.1566 20.976 18.088C21.0162 17.0523 20.7975 16.2785 20.3256 15.7879C19.8545 15.2981 19.2843 15.26 19.1208 15.26C18.5475 15.26 17.5857 15.5499 17.5857 17.4914C17.5857 19.1759 18.3711 20.9633 18.5882 21.4252C17.4443 24.7556 16.2163 27.0356 15.9556 27.5044C11.3594 29.2349 11 30.9081 11 31.3823C11 32.2345 11.6069 32.7432 12.6234 32.7432C15.0932 32.7432 17.347 28.5967 17.7197 27.8767C19.4738 27.1778 21.8216 26.7449 22.4184 26.6416C24.1304 28.2724 26.1104 28.7075 26.9326 28.7075C27.5512 28.7075 28.9999 28.7075 28.9999 27.218C29 25.8348 27.2271 25.344 25.7088 25.344ZM25.5898 26.3219C26.9238 26.3219 27.2764 26.7631 27.2764 26.9963C27.2764 27.1427 27.2208 27.6203 26.5058 27.6203C25.8646 27.6203 24.7575 27.2497 23.6683 26.4456C24.1225 26.3859 24.7947 26.3219 25.5898 26.3219ZM19.0508 16.2079C19.1724 16.2079 19.2525 16.2469 19.3185 16.3385C19.7022 16.8709 19.3928 18.6105 19.0163 19.9718C18.6528 18.8046 18.38 17.0135 18.7638 16.3834C18.8388 16.2604 18.9246 16.2079 19.0508 16.2079ZM18.4029 26.6277C18.8859 25.652 19.4272 24.23 19.722 23.4257C20.3121 24.4134 21.1057 25.3303 21.5647 25.8275C20.1356 26.1288 19.0543 26.4298 18.4029 26.6277ZM11.9594 31.5125C11.9276 31.4748 11.9229 31.3952 11.9469 31.2997C11.9971 31.0995 12.3814 30.1074 15.1608 28.8641C14.7628 29.491 14.1407 30.3867 13.4572 31.0558C12.9761 31.5062 12.6014 31.7345 12.3437 31.7345C12.2515 31.7345 12.1244 31.7094 11.9594 31.5125Z"
                        fill="#D92D20"
                    />
                </svg>

                <h2 class="text-lg font-semibold text-gray-900">Document preview</h2>
            </div>
            <div v-if="!!pdfInfo" class="flex flex-col gap-6">
                <PdfViewer />
                <div>
                    <h3 class="text-xl font-semibold text-gray-900">
                        {{ documentStore.currentDocument?.title }}
                        <!-- <span class="text-md font-semibold text-gray-400">.pdf</span> -->
                    </h3>
                </div>
                <div class="pt-6 border-t border-gray-200">
                    <h3 class="text-md font-semibold text-gray-900 mb-3">Contract details</h3>
                    <div>
                        <div class="flex mb-2">
                            <h4 class="w-full text-sm font-medium text-gray-700">Date created</h4>
                            <p class="w-full text-sm font-normal text-gray-600">
                                {{
                                    documentStore.currentDocument?.timestamp
                                        ? formatDate(documentStore.currentDocument?.timestamp)
                                        : ''
                                }}
                            </p>
                        </div>
                        <div v-if="documentStore.currentDocumentMetaData.signedOn > 0" class="flex mb-2">
                            <h4 class="w-full text-sm font-medium text-gray-700">Date signed</h4>
                            <p class="w-full text-sm font-normal text-gray-600">
                                {{ formatDate(documentStore.currentDocumentMetaData.signedOn) }}
                            </p>
                        </div>
                        <div class="flex mb-2">
                            <h4 class="w-full text-sm font-medium text-gray-700">Signatures</h4>
                            <p class="w-full text-sm font-normal text-gray-600 truncate">
                                {{ documentStore.currentDocumentMetaData.signatures.length }} /
                                {{ documentStore.currentDocumentMetaData.signaturesRequired }}
                            </p>
                        </div>
                        <div class="flex">
                            <h4 class="w-full text-sm font-medium text-gray-700">Author</h4>
                            <p class="w-full text-sm font-normal text-gray-600 truncate">
                                {{ documentStore.currentDocument?.sender.toString() }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="w-full pt-6 border-t border-gray-200 flex justify-between">
                    <ViewDocumentModal v-if="!documentStore.currentDocumentMetaData.signingAllowed" class="w-full" />
                    <SignDocumentModal v-else-if="!documentStore.currentDocumentMetaData.signed" class="w-full" />
                    <ViewDocumentModal v-else class="w-full" />
                    <!-- <p v-else>Document already signed by you.</p> -->
                    <!-- <u-btn color="error" icon="trash-03" /> -->
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
                <path
                    d="M25.7088 25.344C24.586 25.344 23.1808 25.5399 22.7211 25.6088C20.8184 23.6218 20.277 22.4924 20.1553 22.1913C20.3203 21.7673 20.8944 20.1566 20.976 18.088C21.0162 17.0523 20.7975 16.2785 20.3256 15.7879C19.8545 15.2981 19.2843 15.26 19.1208 15.26C18.5475 15.26 17.5857 15.5499 17.5857 17.4914C17.5857 19.1759 18.3711 20.9633 18.5882 21.4252C17.4443 24.7556 16.2163 27.0356 15.9556 27.5044C11.3594 29.2349 11 30.9081 11 31.3823C11 32.2345 11.6069 32.7432 12.6234 32.7432C15.0932 32.7432 17.347 28.5967 17.7197 27.8767C19.4738 27.1778 21.8216 26.7449 22.4184 26.6416C24.1304 28.2724 26.1104 28.7075 26.9326 28.7075C27.5512 28.7075 28.9999 28.7075 28.9999 27.218C29 25.8348 27.2271 25.344 25.7088 25.344ZM25.5898 26.3219C26.9238 26.3219 27.2764 26.7631 27.2764 26.9963C27.2764 27.1427 27.2208 27.6203 26.5058 27.6203C25.8646 27.6203 24.7575 27.2497 23.6683 26.4456C24.1225 26.3859 24.7947 26.3219 25.5898 26.3219ZM19.0508 16.2079C19.1724 16.2079 19.2525 16.2469 19.3185 16.3385C19.7022 16.8709 19.3928 18.6105 19.0163 19.9718C18.6528 18.8046 18.38 17.0135 18.7638 16.3834C18.8388 16.2604 18.9246 16.2079 19.0508 16.2079ZM18.4029 26.6277C18.8859 25.652 19.4272 24.23 19.722 23.4257C20.3121 24.4134 21.1057 25.3303 21.5647 25.8275C20.1356 26.1288 19.0543 26.4298 18.4029 26.6277ZM11.9594 31.5125C11.9276 31.4748 11.9229 31.3952 11.9469 31.2997C11.9971 31.0995 12.3814 30.1074 15.1608 28.8641C14.7628 29.491 14.1407 30.3867 13.4572 31.0558C12.9761 31.5062 12.6014 31.7345 12.3437 31.7345C12.2515 31.7345 12.1244 31.7094 11.9594 31.5125Z"
                    fill="#D92D20"
                />
            </svg>
            <div class="gap-2">
                <h2 class="text-lg font-semibold text-primary">No document selected</h2>
                <p>You have not yet selected a document. Please do so by clicking on a document in the table</p>
            </div>
        </div>
        <div
            v-if="documentStore.loadingDocumentState.sidebar"
            class="w-full h-full absolute top-0 right-0 flex flex-col gap-4 items-center justify-center bg-white"
        >
            <u-spinner size="2xl" />
            <p class="text-sm font-medium text-secondary">
                <!-- Loading document... -->
                {{
                    documentStore.loadingDocumentState.sidebar
                        ? 'Loading document...'
                        : documentStore.loadingDocumentState.sign
                        ? 'Signing document...'
                        : ''
                }}
            </p>
        </div>
    </div>
</template>
