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
import { Principal } from '@dfinity/principal';

// const documentStore = useDocumentStore();
const authStore = useAuthStore();

const props = defineProps(['modelValue', 'template']);

const emit = defineEmits([
    'update:modelValue',
    'update:signature-fields',
    'update:signatures-validation',
    'update:carbon-copy-recievers',
    'update:carbon-copy-recievers-validation',
]);

const editor = ref<any>();
watch(
    () => editor.value?.getHTML(),
    (newHtml) => {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(newHtml as string, 'text/html');

        const newMarks = Array.from(newDoc.querySelectorAll<HTMLElement>(`mark[data-signature]`));

        newMarks.forEach((mark) => {
            mark.removeAttribute('data-color');
            mark.style.backgroundColor = '';
        });

        emit('update:modelValue', (newDoc.getRootNode() as any).body.innerHTML);
    },
);

// const removeBackgroundColorFromSignatureMarks = (htmlString: string) => {
//     // Select all <mark> elements with the 'data-signature' attribute
//     const doc = parseHtmlToDoc(htmlString);
//     const signatureMarks = doc.querySelectorAll('mark[data-signature]');

//     // Iterate over the NodeList and remove the background color
//     signatureMarks.forEach((mark) => {
//         mark.style.backgroundColor = '';
//     });

//     return doc.body.innerHTML;
// };

export interface HighlightExtensionOptions {
    color: string;
    signature: string;
    multicolor: boolean;
}

const customHighlight = Highlight.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            color: {
                parseHTML: (element: any) => element.getAttribute('data-color'),
                // … and customize the HTML rendering.
                renderHTML: (attributes: any) => {
                    return {
                        'data-color': attributes.color,
                        style: `background-color: ${attributes.color}`,
                    };
                },
            },
            signature: {
                renderHTML: (attributes: any) => {
                    return {
                        'data-signature': attributes.signature,
                    };
                },
            },
        };
    },
});

onMounted(() => {
    editor.value = new Editor({
        extensions: [
            Document,
            Text,
            // StarterKit,
            customHighlight.configure({ multicolor: true }),
            Heading.configure({ levels: [1, 2, 3] }),
            HardBreak,
            Paragraph,
            Bold,
            Underline,
        ],
        content: props.modelValue,
        injectCSS: true,
    });

    signatureInputFields.value.push({
        type: 'sender',
        internetIdentity: authStore.identityString,
        color: inputColors.value[0],
        marked: false,
    });
    signatureInputFields.value.push({
        type: 'reciever',
        internetIdentity: '',
        color: inputColors.value[1],
        marked: false,
    });
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});

watch(
    () => props.template,
    (newHtml) => {
        if (!editor.value) return;
        // console.log(newHtml);

        editor.value?.commands.setContent(newHtml);
    },
);

// watch(
//     () => props.modelValue,
//     (newHtml) => {
//         if (!editor.value) return;
//         console.log(newHtml);

//         editor.value?.commands.setContent(newHtml);
//     },
// );

const showPopover = ref(false);
const onOpenPopover = () => {
    if (!showPopover.value) showPopover.value = true;
};
const onClosePopover = () => {
    if (showPopover.value) showPopover.value = false;
};

const parseHtmlToDoc = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc;
};

export type SignatureType = 'sender' | 'reciever';
export interface SignatureInputField {
    type?: SignatureType;
    internetIdentity: string;
    color: string;
    marked?: boolean;
}

const carbonCopyRecievers: Ref<string[]> = ref([]);
const signaturesContainErrors = ref(false);
const signatureInputFields: Ref<SignatureInputField[]> = ref([]);
const inputColors = ref([
    '#FEEE95',
    '#F9DBAF',
    '#FECDD6',
    '#FCCEEE',
    '#F6D0FE',
    '#D9D6FE',
    '#C7D7FE',
    '#B2DDFF',
    '#A5F0FC',
    '#AAF0C4',
]);

watch(signatureInputFields.value, (newFields) => {
    emit(
        'update:signature-fields',
        newFields.filter((field) => field.internetIdentity),
    );
});
const removeInputField = (index: number) => {
    unMarkSignatureField(getMarkedSignatureRange(signatureInputFields.value[index].internetIdentity));
    signatureInputFields.value.splice(index, 1);
};
const handleSignatureMarking = (signature: string) => {
    if (!window.getSelection()?.toString()) return;

    const oldHtml = editor.value?.getHTML();
    markSignatureField(signature);
    const newHtml = editor.value?.getHTML();
    if (newHtml && oldHtml && newHtml !== oldHtml) {
        updateSignatureMarks(oldHtml as string, newHtml as string);
    }
    updateSignatureMarks(oldHtml as string, newHtml as string);
};
const markSignatureField = (signature: string) => {
    editor.value
        ?.chain()
        .focus()
        .toggleHighlight({
            color: signatureInputFields.value.filter((field) => field.internetIdentity === signature)[0].color,
            signature,
        })
        .run();
};

const addSignatureField = () => {
    const color = inputColors.value[signatureInputFields.value.length];
    signatureInputFields.value.push({
        type: signatureInputFields.value.length === 0 ? 'sender' : 'reciever',
        internetIdentity: '',
        color,
        marked: false,
    });
};
const getSignatureMarks = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const marks = Array.from(doc.querySelectorAll<HTMLElement>(`mark[data-signature]`));
    return marks;
};
const getMarkedSignatureFields = () => {
    const marks: HTMLElement[] = getSignatureMarks(editor.value?.getHTML() as string);
    const signatureFields: SignatureInputField[] = [];

    marks.forEach((mark) => {
        signatureFields.push({
            internetIdentity: mark.getAttribute('data-signature') as string,
            color: mark.getAttribute('data-color') as string,
        });
    });

    signatureFields.forEach((field) => {
        const index = signatureInputFields.value.findIndex(
            (inputField) => inputField.internetIdentity === field.internetIdentity,
        );
        if (index !== -1) {
            signatureInputFields.value[index].marked = true;
        }
    });
    return signatureFields;
};

type SignatureMarkRangeInEditor = { from: number; to: number };
const updateSignatureMarks = (oldHtmlString: string, newHtmlString: string) => {
    if (!editor.value) return;
    const newDoc = parseHtmlToDoc(newHtmlString);
    const oldDoc = parseHtmlToDoc(oldHtmlString);

    // Process each field in signatureInputFields
    signatureInputFields.value.forEach((field) => {
        const newMarks = Array.from(
            newDoc.querySelectorAll<HTMLElement>(`mark[data-signature="${field.internetIdentity}"]`),
        );
        const oldMarks = Array.from(
            oldDoc.querySelectorAll<HTMLElement>(`mark[data-signature="${field.internetIdentity}"]`),
        );
        if (newMarks.length !== oldMarks.length && oldMarks.length > 0) {
            const oldMark = oldMarks.find((mark) => mark.getAttribute('data-signature') === field.internetIdentity);
            editor.value?.state.doc.descendants((node, pos) => {
                if (node.marks.length > 0 && node.text === oldMark?.innerText) {
                    const range: SignatureMarkRangeInEditor = { from: pos, to: pos + node.nodeSize };
                    editor.value?.chain().focus().setTextSelection(range).toggleHighlight().run();
                }
            });
        }

        if (newMarks.length === 0) {
            signatureInputFields.value.forEach((field) => {
                field.marked = false;
            });
        }
        newMarks.forEach((mark) => {
            const index = signatureInputFields.value.findIndex(
                (inputField) => inputField.internetIdentity === mark.getAttribute('data-signature'),
            );

            if (index !== -1) {
                signatureInputFields.value[index].marked = true;
            }
        });
    });
    getMarkedSignatureFields();
};

const getMarkedSignatureRange = (signature: string) => {
    let range: SignatureMarkRangeInEditor = { from: 0, to: 0 };
    editor.value?.state.doc.descendants((node, pos) => {
        if (node.marks.length > 0 && node.marks[0].attrs.signature === signature) {
            range = { from: pos, to: pos + node.nodeSize };
        }
    });
    return range;
};

const unMarkSignatureField = (range: SignatureMarkRangeInEditor) => {
    editor.value?.chain().focus().setTextSelection(range).toggleHighlight().run();
};

const signatureIsDuplicate = (signature: string) => {
    return signatureInputFields.value.filter((field) => field.internetIdentity === signature).length > 1;
};
const signaturesAreRequiredLength = () => {
    return signatureInputFields.value.filter((field) => field.internetIdentity.length < 63).length === 0;
};
const signatureFieldsHasDuplicateInternetIdentities = () => {
    const signatures = signatureInputFields.value.map((field) => field.internetIdentity);
    const uniqueSignatures = Array.from(new Set(signatures));

    return uniqueSignatures.length === signatureInputFields.value.length;
};
const principalExists = (internetIdentity: string) => {
    try {
        Principal.fromText(internetIdentity);
        return true;
    } catch (error) {
        return false;
    }
};

const signaturesAreValid = computed(() => {
    if (!signaturesAreRequiredLength()) return false;

    if (signatureInputFields.value.length <= 1) return false;

    if (!signatureFieldsHasDuplicateInternetIdentities()) return false;

    if (!signatureInputFields.value.every((field) => field.marked)) return false;

    if (!signatureInputFields.value.every((field) => principalExists(field.internetIdentity))) return false;

    return true;
});

watch(signaturesAreValid, (newValid) => {
    emit('update:signatures-validation', newValid);
});

const addCarbonCopyReciever = () => {
    carbonCopyRecievers.value.push('');
};
const removeCarbonCopyReciever = (index: number) => {
    carbonCopyRecievers.value.splice(index, 1);
};
const carbonCopyRecieverIsDuplicate = (internetIdentity: string) => {
    return carbonCopyRecievers.value.filter((reciever) => reciever === internetIdentity).length > 1;
};

watch(carbonCopyRecievers.value, (newRecievers) => {
    emit('update:carbon-copy-recievers', newRecievers);
});
const carbonCopyRecieverHasDuplicateInternetIdentities = () => {
    const signatures = carbonCopyRecievers.value;
    const uniqueSignatures = Array.from(new Set(signatures));

    return uniqueSignatures.length === carbonCopyRecievers.value.length;
};
const carbonCopyRecieversAreValid = computed(() => {
    if (carbonCopyRecievers.value.length === 0) return true;

    if (!carbonCopyRecievers.value.every((reciever) => reciever.length === 63)) return false;

    if (!carbonCopyRecieverHasDuplicateInternetIdentities()) return false;

    if (
        signatureInputFields.value.filter((signature) => carbonCopyRecievers.value.includes(signature.internetIdentity))
            .length > 0
    ) {
        return false;
    }

    return true;
});
watch(carbonCopyRecieversAreValid, (newValid) => {
    emit('update:carbon-copy-recievers-validation', newValid);
});
</script>

<template>
    <div v-if="editor">
        <div class="flex gap-4">
            <div class="w-full">
                <div class="flex gap-4">
                    <div class="w-full">
                        <label class="block text-sm font-medium text-secondary mb-1.5"> Document </label>
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
            <div class="max-w-sm w-full">
                <div class="w-full">
                    <label class="block text-sm font-medium text-secondary mb-1.5">
                        <div class="flex gap-x-2">
                            Created signature fields
                            <Popover class="z-10 h-5 relative">
                                <PopoverButton
                                    class="h-full relative"
                                    @mouseover="onOpenPopover()"
                                    @mouseleave="onClosePopover()"
                                >
                                    <u-icon icon="help-circle" size="xs" class="fg-quinary" />
                                </PopoverButton>
                                <transition
                                    enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="transform scale-95 opacity-0"
                                    enter-to-class="transform scale-100 opacity-100"
                                    leave-active-class="transition duration-75 ease-out"
                                    leave-from-class="transform scale-100 opacity-100"
                                    leave-to-class="transform scale-95 opacity-0"
                                >
                                    <div v-if="showPopover" class="z-10 relative">
                                        <PopoverPanel
                                            static
                                            class="absolute p-3 rounded-md bg-primary-solid shadow-lg w-[320px] left-1/2 transform -translate-x-1/2 top-2"
                                        >
                                            <div
                                                class="rounded-[1px] w-3 h-3 absolute bg-primary-solid -top-1.5 left-1/2 transform -translate-x-1/2 rotate-45"
                                            />
                                            <label class="block text-xs font-semibold mb-1 text-white">
                                                Signature field
                                            </label>
                                            <p class="text-xs font-normal text-gray-300">
                                                Whatever you highlight and select as a signature field will be replaced
                                                with the Internet Identity of the signer.
                                            </p>
                                            <label class="block text-xs font-semibold mb-1 mt-3 text-white">
                                                Adding signature fields
                                            </label>
                                            <div class="text-xs font-normal text-gray-300">
                                                <div class="flex">
                                                    <p class="text-xs font-semibold text-white">1.&nbsp;</p>
                                                    Click the button "Add signature field".
                                                </div>
                                                <div class="flex">
                                                    <p class="text-xs font-semibold text-white">2.&nbsp;</p>
                                                    Fill in the Internet Identity of the signer.
                                                </div>
                                                <div class="flex">
                                                    <p class="text-xs font-semibold text-white">3.&nbsp;</p>
                                                    Highlight the text you want to have replaced with the signature.
                                                </div>
                                                <div class="flex">
                                                    <p class="text-xs font-semibold text-white">4.&nbsp;</p>
                                                    Click the button on the right side of the Internet Identity field to
                                                    mark it as the signature input.
                                                </div>
                                            </div>
                                            <label class="block text-xs font-semibold mb-1 mt-3 text-white">
                                                Highlight color
                                            </label>
                                            <p class="text-xs font-normal text-gray-300">
                                                The highlight color will not show up in the final document.
                                            </p>
                                        </PopoverPanel>
                                    </div>
                                </transition>
                            </Popover>
                        </div>
                    </label>
                    <div class="flex flex-col gap-y-10 w-full overflow-visible">
                        <div class="gap-y-2 divide-y divide-gray-300">
                            <div
                                v-for="(signature, index) in signatureInputFields"
                                :key="index"
                                class="pt-3 pb-4"
                                :class="`${index === 0 ? '!pt-0' : ''}`"
                            >
                                <div class="">
                                    <label :for="`signature-${index}`" class="block text-sm font-medium text-secondary">
                                        {{ index === 0 ? 'Your signature' : 'Signature of reciever' }}
                                    </label>
                                    <div class="flex gap-x-2 w-full mt-1.5">
                                        <input
                                            :id="`signature-${index}`"
                                            v-model="signature.internetIdentity"
                                            v-maska
                                            data-maska="*****-*****-*****-*****-*****-*****-*****-*****-*****-*****-***"
                                            type="text"
                                            name="reciever"
                                            :class="`
                        block bg-white w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-primary
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6
                      `"
                                            placeholder="aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaa"
                                        />
                                        <u-btn
                                            variant="outlined"
                                            color="gray"
                                            icon="text-input"
                                            :disabled="
                                                signature.internetIdentity.length < 63 ||
                                                signatureIsDuplicate(signature.internetIdentity)
                                            "
                                            @click="handleSignatureMarking(signature.internetIdentity)"
                                        />
                                        <u-btn
                                            v-if="index > 1"
                                            color="error"
                                            icon="trash-03"
                                            @click="removeInputField(index)"
                                        />
                                    </div>
                                </div>
                                <div
                                    v-if="!signature.marked && signaturesContainErrors"
                                    class="flex items-center gap-x-1 mt-1.5"
                                >
                                    <p class="fg-error-primary">Needs to be added to the document.</p>
                                </div>
                                <div
                                    v-if="
                                        signature.internetIdentity !== '' &&
                                        !principalExists(signature.internetIdentity)
                                    "
                                    class="flex items-center gap-x-1 mt-1.5"
                                >
                                    <p class="fg-error-primary">
                                        Internet Identity is not valid. Please check the format.
                                    </p>
                                </div>
                                <div
                                    v-if="signatureIsDuplicate(signature.internetIdentity)"
                                    class="flex items-center gap-x-1 mt-1.5"
                                >
                                    <p class="fg-error-primary">
                                        Internet Identity already used for another signature.
                                    </p>
                                </div>
                                <div class="flex items-center gap-x-1 mt-3">
                                    <div
                                        class="border border-gray-300 rounded-xl h-4 w-4"
                                        :style="`background-color: ${signature.color}`"
                                    ></div>
                                    <p>Highlight color</p>
                                </div>
                            </div>
                            <u-btn
                                variant="outlined"
                                color="gray"
                                prepend-icon="plus"
                                block
                                class="!border-b"
                                @click="addSignatureField()"
                            >
                                Add signature field
                            </u-btn>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-secondary mb-1.5">
                                CC (Carbon Copy) Recipients
                            </label>
                            <div class="gap-y-2 divide-y divide-gray-300">
                                <div
                                    v-for="index in carbonCopyRecievers.length"
                                    :key="index"
                                    class="pt-3 pb-4"
                                    :class="`${index === 1 ? '!pt-0' : ''}`"
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
                                        v-if="carbonCopyRecieverIsDuplicate(carbonCopyRecievers[index - 1])"
                                        class="flex items-center gap-x-1 mt-1.5"
                                    >
                                        <p class="fg-error-primary">Internet Identity already used for another CC.</p>
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
