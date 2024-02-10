import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth.ts';
// import type { Ref } from 'vue';

export interface AddTemplateData {
    content: string;
    description: string;
    keywords: string[];
    priv: boolean;
    copied: Principal[];
}

export interface UpdateTemplateData {
    index: string;
    content: string;
    description: string;
    keywords: string[];
    copied: Principal[];
}

export const useTemplateStore: any = defineStore('template', () => {
    const authStore = useAuthStore();
    const currentTemplate = ref();
    const myTemplates = ref([]);
    const allTemplates = ref([]);
    const loadingTemplateState = ref({
        table: false,
        preview: false,
        sidebar: false,
        update: false,
    });

    const onAddTemplate = async (template: AddTemplateData) => {
        const addTemplateResponse = await authStore.authenticatedActor?.add_template(
            template.content,
            template.description,
            template.keywords,
            template.priv,
            template.copied,
        );

        if (addTemplateResponse) {
            // console.log(addTemplateResponse);
            return true;
        }
        return false;
    };

    const onUpdateTemplate = async (template: UpdateTemplateData) => {
        const updateTemplateResponse = await authStore.authenticatedActor?.update_template(
            template.index,
            template.content,
            template.description,
            template.keywords,
            template.copied,
        );

        if (updateTemplateResponse) {
            // console.log(addTemplateResponse);
            return true;
        }
        return false;
    };

    const onGetMyTemplates = async () => {
        const templates = await authStore.authenticatedActor?.get_templates();
        if (templates) {
            myTemplates.value = [];
            templates.forEach((template: any) => {
                if (template.sender.toText() === authStore.identityString) {
                    myTemplates.value.push(template);
                }
            });
            return templates;
        }
        return false;
    };

    const onGetTemplates = async () => {
        const templates = await authStore.authenticatedActor?.get_templates();
        if (templates) {
            allTemplates.value = [];
            templates.forEach((template: any) => {
                allTemplates.value.push({
                    description: template.description,
                    content: template.content,
                });
            });
            return templates;
        }
        return false;
    };

    const onGetSingleTemplate = async (id: string) => {
        const template = await authStore.authenticatedActor?.get_template(id);
        if (template) {
            currentTemplate.value = template[0];
            return template;
        }
        return false;
    };

    return {
        currentTemplate,
        myTemplates,
        allTemplates,
        loadingTemplateState,
        onAddTemplate,
        onUpdateTemplate,
        onGetTemplates,
        onGetMyTemplates,
        onGetSingleTemplate,
    };
});
