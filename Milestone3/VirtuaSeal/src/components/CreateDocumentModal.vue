<script setup lang="ts">
import { useDocumentStore, AddDocumentData } from '../stores/document.ts';
import { useTemplateStore } from '../stores/template.ts';
import type { Ref } from 'vue';
import { ref, toRaw, computed } from 'vue';
import DocumentEditor from './DocumentEditor.vue';
import UBtn from '../components/UBtn.vue';
import UIcon from './UIcon.vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { Principal } from '@dfinity/principal';
import { SignatureInputField } from './DocumentEditor.vue';
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    ComboboxLabel,
    ComboboxButton,
} from '@headlessui/vue';

const templateStore = useTemplateStore();

const selectedTemplate: any = ref(templateStore.allTemplates[0]);
const query = ref('');

const filteredTemplates = computed(() =>
    query.value === ''
        ? templateStore.allTemplates
        : templateStore.allTemplates.filter((template) => {
              return template.description.toLowerCase().includes(query.value.toLowerCase());
          }),
);

const applyTemplate = () => {
    document.value = selectedTemplate.value.content;

    // documentTitle.value = selectedTemplate.value.description;
};

const documentStore = useDocumentStore();

const documentTitle = ref('');
const document = ref(`If the Recipient is an individual
Signed and Delivered as a Deed by:
[name of Recipient] in the presence of:
_____________________________
Signature
_____________________________
Signature of witness
_____________________________
Name of witness
_____________________________`);

const init = async () => {
    selectedTemplate.value = '';
    documentTitle.value = '';
    document.value = '';
    query.value = '';
    templateStore.onGetTemplates();
};

const recievers: Ref<SignatureInputField[]> = ref([]);
const copied: Ref<string[]> = ref([]);

const isOpen: Ref<boolean> = ref(false);
const closeModal: () => boolean = () => (isOpen.value = false);
const openModal = () => {
    init();
    isOpen.value = true;
};

const loading = ref(false);
const createDoc = async () => {
    loading.value = true;
    const documentData: AddDocumentData = {
        title: documentTitle.value,
        content: document.value,
        recievers: recievers.value.map((reciever) => Principal.fromText(toRaw(reciever).internetIdentity)),
        copied: copied.value.map((cc) => Principal.fromText(toRaw(cc))),
    };

    const documentAddedResponse = await documentStore.onAddDocument(documentData);

    if (documentAddedResponse) closeModal();
    loading.value = false;
};
const signaturesAreValid = ref(false);
const onUpdateSignatures = (signatures: SignatureInputField[]) => {
    recievers.value = signatures.slice(1).map((signature) => signature);
};
const copiedAreValid = ref(true);
</script>

<template>
    <div>
        <u-btn prepend-icon="plus" @click="openModal()">Create Document</u-btn>
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
                  w-full max-w-6xl transform overflow-visible rounded-xl border border-primary
                  bg-white p-6 text-left align-middle shadow-xl transition-all
                `"
                            >
                                <DialogTitle as="h3" class="text-lg font-semibold leading-7 text-primary">
                                    Create a new document
                                </DialogTitle>
                                <div class="mt-5 mb-8">
                                    <div class="mb-8 flex gap-x-4">
                                        <div class="w-full">
                                            <label class="block text-sm font-medium text-secondary mb-1.5">
                                                Document Title
                                            </label>
                                            <input
                                                v-model="documentTitle"
                                                type="text"
                                                placeholder="Enter document title"
                                                :class="`
                        block bg-white w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-primary
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6
                      `"
                                            />
                                        </div>
                                        <Combobox
                                            v-model="selectedTemplate"
                                            as="div"
                                            class="w-full max-w-sm"
                                            @update:modelValue="applyTemplate()"
                                        >
                                            <ComboboxLabel
                                                class="block text-sm font-medium text-secondary text-primary"
                                            >
                                                Selected template
                                            </ComboboxLabel>
                                            <div class="relative mt-1.5">
                                                <ComboboxInput
                                                    class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 placeholder:text-gray-400"
                                                    :display-value="(template) => (template as any).description"
                                                    placeholder="Select a template"
                                                    @change="query = $event.target.value"
                                                />
                                                <ComboboxButton
                                                    class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
                                                >
                                                    <u-icon
                                                        icon="chevron-selector-vertical"
                                                        class="text-gray-400"
                                                        aria-hidden="true"
                                                        size="xs"
                                                    />
                                                    <!-- <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" /> -->
                                                </ComboboxButton>

                                                <ComboboxOptions
                                                    v-if="filteredTemplates.length > 0"
                                                    class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                                >
                                                    <ComboboxOption
                                                        v-for="template in filteredTemplates"
                                                        :key="template.id"
                                                        v-slot="{ active, selected }"
                                                        :value="template"
                                                        as="template"
                                                    >
                                                        <li
                                                            :class="[
                                                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                                                active ? 'bg-brand-600 text-white' : 'text-gray-900',
                                                            ]"
                                                        >
                                                            <span
                                                                :class="['block truncate', selected && 'font-semibold']"
                                                            >
                                                                {{ template.description }}
                                                            </span>

                                                            <span
                                                                v-if="selected"
                                                                :class="[
                                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                    active ? 'text-white' : 'text-brand-600',
                                                                ]"
                                                            >
                                                                <u-icon icon="check" aria-hidden="true" size="xs" />
                                                                <!-- <CheckIcon class="h-5 w-5" aria-hidden="true" /> -->
                                                            </span>
                                                        </li>
                                                    </ComboboxOption>
                                                </ComboboxOptions>
                                            </div>
                                        </Combobox>
                                    </div>
                                    <DocumentEditor
                                        v-model="document"
                                        :template="toRaw(selectedTemplate.content)"
                                        @update:signature-fields="onUpdateSignatures($event)"
                                        @update:signatures-validation="signaturesAreValid = $event"
                                        @update:carbon-copy-recievers="copied = $event"
                                        @update:carbon-copy-recievers-validation="copiedAreValid = $event"
                                    />
                                </div>

                                <div class="flex justify-end gap-x-3">
                                    <u-btn variant="outlined" color="gray" @click="closeModal()"> Cancel </u-btn>
                                    <u-btn
                                        prepend-icon="plus"
                                        :loading="loading"
                                        :disabled="!signaturesAreValid || !copiedAreValid || !documentTitle"
                                        @click="createDoc()"
                                    >
                                        Create Document
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
