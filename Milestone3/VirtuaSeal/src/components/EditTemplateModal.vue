<script setup lang="ts">
import { useTemplateStore } from '../stores/template.ts';
import type { Ref } from 'vue';
import { ref, toRaw, computed } from 'vue';
import DocumentTemplateEditor from './DocumentTemplateEditor.vue';
import UBtn from '../components/UBtn.vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { vMaska } from 'maska';
import { Principal } from '@dfinity/principal';
// import { SignatureInputField } from './DocumentEditor.vue';
// import { Switch } from '@headlessui/vue';

import type { ButtonProps } from '../components/UBtn.vue';

withDefaults(
    defineProps<{
        btnVariant?: ButtonProps['variant'];
        btnColor?: ButtonProps['color'];
        btnIcon?: string;
    }>(),
    {
        btnVariant: 'default',
        btnColor: 'brand',
        btnIcon: 'edit-04',
    },
);

const templateStore = useTemplateStore();

const templateDescription = ref('');
const templateKeyWords = ref('');
const template = ref(``);

// const templateIsPrivate = ref(false);

const isOpen: Ref<boolean> = ref(false);
const closeModal: () => boolean = () => (isOpen.value = false);
const openModal = () => {
    template.value = toRaw(templateStore.currentTemplate).content;
    templateDescription.value = toRaw(templateStore.currentTemplate).description;
    templateKeyWords.value = toRaw(templateStore.currentTemplate).keywords.join(', ');
    // templateIsPrivate.value = toRaw(templateStore.currentTemplate).private;
    carbonCopyRecievers.value = toRaw(templateStore.currentTemplate).copied.map((cc) => cc.toText());
    isOpen.value = true;
};
// const templateInvalid = ref(true);

const templateHasContent = computed(() => {
    if (template.value === '<p></p>') return false;
    return template.value !== '';
});

const templateHasDescription = computed(() => {
    return templateDescription.value.length > 0;
});

const loading = ref(false);
const updateTemplate = async () => {
    loading.value = true;

    const templateUpdated = templateStore.onUpdateTemplate({
        index: templateStore.currentTemplate.id.toString(),
        content: template.value,
        description: templateDescription.value,
        keywords: seperateKeywords(),
        copied: carbonCopyRecievers.value.map((cc) => Principal.fromText(toRaw(cc))),
    });

    if (templateUpdated) closeModal();
    loading.value = false;
};

const seperateKeywords = () => {
    return templateKeyWords.value.split(',').map((keyword) => keyword.trim());
};

const carbonCopyRecievers: Ref<string[]> = ref([]);
const carbonCopyRecieverIsDuplicate = (internetIdentity: string) => {
    return carbonCopyRecievers.value.filter((reciever) => reciever === internetIdentity).length > 1;
};
const removeCarbonCopyReciever = (index: number) => {
    carbonCopyRecievers.value.splice(index, 1);
};

const addCarbonCopyReciever = () => {
    carbonCopyRecievers.value.push('');
};
</script>

<template>
    <div>
        <u-btn :variant="btnVariant" :color="btnColor" :prepend-icon="btnIcon" block @click="openModal()">
            Edit Template
        </u-btn>
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
                                    Update your template
                                </DialogTitle>
                                <div class="mt-5 mb-8">
                                    <div class="flex gap-4">
                                        <div class="w-full">
                                            <DocumentTemplateEditor v-model="template" />
                                        </div>
                                        <div class="max-w-sm w-full flex flex-col gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-secondary mb-1.5">
                                                    Template Description
                                                </label>
                                                <input
                                                    v-model="templateDescription"
                                                    type="text"
                                                    :class="`
                        block bg-white w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-primary
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6
                      `"
                                                />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-secondary mb-1.5">
                                                    Template Keywords
                                                </label>
                                                <input
                                                    v-model="templateKeyWords"
                                                    type="text"
                                                    placeholder="non-disclosure, agreement, contract"
                                                    :class="`
                        block bg-white w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-primary
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6
                      `"
                                                />
                                                <p class="mt-1.5">Comma seperated.</p>
                                            </div>
                                            <!-- <div class="flex">
                                                <Switch
                                                    id="template-is-private"
                                                    v-model="templateIsPrivate"
                                                    :class="templateIsPrivate ? 'bg-brand-600' : 'bg-gray-200'"
                                                    class="relative inline-flex h-5 w-9 items-center rounded-full"
                                                >
                                                    <span class="sr-only">Template is private</span>
                                                    <span
                                                        :class="
                                                            templateIsPrivate ? 'translate-x-4.5' : 'translate-x-0.5'
                                                        "
                                                        class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                                                    />
                                                </Switch>
                                                <label
                                                    class="ml-2 text-sm font-medium text-secondary"
                                                    for="template-is-private"
                                                >
                                                    Template is {{ templateIsPrivate ? 'private' : 'public' }}
                                                </label>
                                            </div> -->
                                            <div>
                                                <label class="block text-sm font-medium text-secondary mb-1.5">
                                                    CC (Carbon Copy) Recipients
                                                </label>
                                                <div
                                                    v-for="index in carbonCopyRecievers.length"
                                                    :key="index"
                                                    class="pb-4"
                                                >
                                                    <div class="flex gap-x-2 w-full mt-1.5">
                                                        <input
                                                            :id="`carbonCopy-${index - 1}`"
                                                            v-model="carbonCopyRecievers[index - 1]"
                                                            v-maska
                                                            data-maska="*****-*****-*****-*****-*****-*****-*****-*****-*****-*****-***"
                                                            type="text"
                                                            name="carbonCopy"
                                                            :class="`
                        block bg-white w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-primary
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6
                      `"
                                                            placeholder="aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaa"
                                                        />
                                                        <u-btn
                                                            color="error"
                                                            icon="trash-03"
                                                            @click="removeCarbonCopyReciever(index - 1)"
                                                        />
                                                    </div>
                                                    <div
                                                        v-if="
                                                            carbonCopyRecieverIsDuplicate(
                                                                carbonCopyRecievers[index - 1],
                                                            )
                                                        "
                                                        class="flex items-center gap-x-1 mt-1.5"
                                                    >
                                                        <p class="fg-error-primary">
                                                            Internet Identity already used for another CC.
                                                        </p>
                                                    </div>
                                                </div>
                                                <u-btn
                                                    variant="outlined"
                                                    color="gray"
                                                    prepend-icon="plus"
                                                    block
                                                    class="!border-b"
                                                    @click="addCarbonCopyReciever()"
                                                >
                                                    Add CC
                                                </u-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-end gap-x-3">
                                    <u-btn variant="outlined" color="gray" @click="closeModal()"> Cancel </u-btn>
                                    <u-btn
                                        prepend-icon="plus"
                                        :disabled="!templateHasDescription || !templateHasContent"
                                        :loading="loading"
                                        @click="updateTemplate()"
                                    >
                                        Update Template
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
