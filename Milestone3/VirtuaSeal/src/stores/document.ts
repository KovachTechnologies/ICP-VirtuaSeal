import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth.ts';
import type { Ref } from 'vue';

export interface AddDocumentData {
    title: string;
    content: string;
    recievers: Principal[];
    copied: Principal[];
}

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
    title: string;
    sender: string;
    recievers: string[];
    copied: string[];
    timestamp: bigint;
}
export interface DocumentSignatures {
    document_id: string;
    id: bigint;
    initials: string;
    signature: string;
    signer: Principal;
    timestamp: bigint;
}

export const useDocumentStore: any = defineStore('document', () => {
    const authStore = useAuthStore();
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

    const onResetDocumentMetaData = () => {
        currentDocumentMetaData.value = {
            signatures: [] as DocumentSignatures[],
            signed: false,
            signedOn: BigInt(0),
            signingAllowed: false,
            signaturesRequired: 0,
        };
    };

    const onGetDocuments = async () => {
        loadingDocumentState.value.table = true;
        myDocuments.value = [];
        const docs = await authStore.authenticatedActor?.get_documents();
        if (docs) {
            for (const doc of docs) {
                myDocuments.value.push({
                    index: doc.id,
                    id: doc.id.toString(),
                    title: doc.title,
                    sender: doc.sender.toString(),
                    recievers: (doc.target as Principal[]).map((r) => r.toString()),
                    copied: (doc.copied as Principal[]).map((r) => r.toString()),
                    timestamp: doc.timestamp,
                });
            }
        }
        loadingDocumentState.value.table = false;
    };

    const onGetSingleDocument = async (documentId: string) => {
        currentDocument.value = null;
        onResetDocumentMetaData();
        loadingDocumentState.value.preview = true;
        loadingDocumentState.value.sidebar = true;
        const documentResponse = await authStore.authenticatedActor?.get_document(documentId);
        if (documentResponse) {
            const doc = documentResponse;
            currentDocument.value = doc[0] as any;
            currentDocumentMetaData.value.signed = await authStore.authenticatedActor?.signature_exists(
                documentId,
                Principal.fromText(authStore.identityString),
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
            Principal.fromText(authStore.identityString),
        );
        const signaturesResponse = await authStore.authenticatedActor?.get_signatures(documentId);
        currentDocumentMetaData.value.signatures = [];
        if (signaturesResponse.length > 0) {
            currentDocumentMetaData.value.signatures = signaturesResponse;
            currentDocumentMetaData.value.signedOn = signaturesResponse.filter(
                (signature) => signature.signature === authStore.identityString,
            )[0]?.timestamp;
        }
        loadingDocumentState.value.preview = false;
        loadingDocumentState.value.sidebar = false;
    };

    const onSignDocument = async (documentId: bigint = currentDocument.value?.id as any) => {
        loadingDocumentState.value.sign = true;

        try {
            // Adding signature
            const signPromise = authStore.authenticatedActor?.add_signature(
                documentId.toString(),
                authStore.identityString,
                authStore.identityString,
            );

            // Wait for the signature addition to complete
            const signResponse = await signPromise;

            if (signResponse) {
                // // Parsing and preparing for document update
                // const parser = new DOMParser();
                // const doc = parser.parseFromString(currentDocument.value?.content as string, 'text/html');
                // console.log(doc);

                // const signatureMark = doc.querySelector(
                //     `[data-signature="${authStore.identityString}"]`,
                // ) as HTMLElement;

                // signatureMark.innerHTML = authStore.identityString;

                // console.log(documentId.toString());
                // console.log(doc.body.innerHTML);

                // console.log(authStore.authenticatedActor?.update_document(documentId.toString(), doc.body.innerHTML));

                // await authStore.authenticatedActor?.update_document(documentId.toString(), doc.body.innerHTML);
                await onGetSingleDocument(documentId.toString());
            }
        } catch (error) {
            console.error('Error in onSignDocument:', error);
        } finally {
            // Ensure loading state is reset even if an error occurs
            loadingDocumentState.value.sign = false;
        }

        // Return false to indicate failure if the signature addition is not successful
        return false;
    };

    const onAddDocument = async (document: AddDocumentData) => {
        const addDocumentResponse = await authStore.authenticatedActor?.add_document(
            document.title,
            document.content,
            document.recievers,
            document.copied,
        );

        if (addDocumentResponse) {
            await onGetDocuments();
            return true;
        }
        return false;
    };

    return {
        currentDocument,
        currentDocumentMetaData,
        loadingDocumentState,
        myDocuments,
        onGetDocuments,
        onGetSingleDocument,
        onSignDocument,
        onAddDocument,
    };
});
