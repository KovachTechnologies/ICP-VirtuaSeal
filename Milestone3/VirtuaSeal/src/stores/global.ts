// import { backend } from '../declarations/backend';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth.ts';
import type { Ref } from 'vue';

export interface DocumentData {
    id: bigint;
    hash: number;
    copied: Principal[];
    sender: Principal;
    target: Principal[];
    content: string;
    timestamp: bigint;
    title: string;
}
export interface DocumentList {
    index: bigint;
    id: string;
    sender: string;
    recievers: string[];
}
export interface DocumentSignatures {
    document_id: string;
    id: bigint;
    initials: string;
    signature: string;
    signer: Principal;
    timestamp: bigint;
}

export const useGlobalStore: any = defineStore('global', () => {
    const authStore = useAuthStore();
    const user = ref('');
    const myDocuments: Ref<DocumentList[]> = ref([]);
    const currentDocument: Ref<DocumentData | null> = ref(null);
    const currentDocumentMetaData = ref({
        signatures: [] as DocumentSignatures[],
        signed: false,
        signedOn: BigInt(0),
        signingAllowed: false,
        signaturesRequired: 0,
    });
    const loadingDocumentState = ref({
        table: false,
        preview: false,
        sidebar: false,
        sign: false,
    });

    const onGetDocuments = async () => {
        loadingDocumentState.value.table = true;
        myDocuments.value = [];
        const docs = await authStore.authenticatedActor?.get_documents();
        if (docs) {
            for (const doc of docs) {
                myDocuments.value.push({
                    index: doc.id,
                    id: doc.id.toString(),
                    sender: doc.sender.toString(),
                    recievers: (doc.target as Principal[]).map((r) => r.toString()),
                });
            }
        }
        loadingDocumentState.value.table = false;
    };

    const onGetSingleDocument = async (documentId: string) => {
        currentDocument.value = null;
        currentDocumentMetaData.value.signed = false;
        loadingDocumentState.value.preview = true;
        const documentResponse = await authStore.authenticatedActor?.get_document(documentId);

        if (documentResponse) {
            const doc = documentResponse;
            currentDocument.value = doc[0] as any;
            currentDocumentMetaData.value.signed = await authStore.authenticatedActor?.signature_exists(
                documentId,
                Principal.fromText(user.value),
            );
        } else {
            currentDocument.value = null;
            return;
        }

        if (currentDocument.value) {
            currentDocumentMetaData.value.signaturesRequired = currentDocument.value.target.length + 1;
        }

        currentDocumentMetaData.value.signingAllowed = await authStore.authenticatedActor?.sign_authorized(
            documentId,
            Principal.fromText(user.value),
        );

        const signaturesResponse = await authStore.authenticatedActor?.get_signatures(documentId);
        currentDocumentMetaData.value.signatures = [];
        if (signaturesResponse.length > 0) {
            currentDocumentMetaData.value.signatures = signaturesResponse;
            currentDocumentMetaData.value.signedOn = signaturesResponse.filter(
                (signature) => signature.signature === user.value,
            )[0]?.timestamp;
        }

        loadingDocumentState.value.preview = false;
    };
    const onSignDocument = async (documentId: bigint = currentDocument.value?.id as any) => {
        loadingDocumentState.value.sign = true;
        const signResponse = await authStore.authenticatedActor?.add_signature(
            documentId.toString(),
            user.value,
            user.value,
        );
        if (signResponse) {
            await onGetSingleDocument(documentId.toString());
            const parser = new DOMParser();
            const doc = parser.parseFromString(currentDocument.value?.content as string, 'text/html');
            const signatureMark = doc.querySelector(`[data-signature="${user.value.slice(0, 27)}"]`) as HTMLElement;
            signatureMark.innerHTML = user.value;

            await authStore.authenticatedActor?.update_document(documentId.toString(), doc.body.innerHTML);

            loadingDocumentState.value.sign = false;
            return true;
        }
        loadingDocumentState.value.sign = false;
        return false;
    };

    return {
        user,
        currentDocument,
        currentDocumentMetaData,
        loadingDocumentState,
        myDocuments,
        onGetDocuments,
        onGetSingleDocument,
        onSignDocument,
    };
});
