import { defineStore } from 'pinia';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId } from '../declarations/backend';
import { ref, toRaw } from 'vue';
import type { Ref } from 'vue';

const defaultOptions = {
    /**
     *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
     */
    createOptions: {
        idleOptions: {
            // Set to true if you do not want idle functionality
            // disableIdle: true,
        },
    },
    /**
     * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
     */
    loginOptions: {
        identityProvider:
            process.env.DFX_NETWORK === 'ic'
                ? 'https://identity.ic0.app/#authorize'
                : `http://localhost:4943?canisterId=be2us-64aaa-aaaaa-qaabq-cai#authorize`,
    },
};

function actorFromIdentity(identity) {
    return createActor(canisterId, {
        agentOptions: {
            identity,
        },
    });
}

export const useAuthStore: any = defineStore('auth', () => {
    const isReady: Ref<boolean> = ref(false);
    const isAuthenticated = ref(null);
    const authClient = ref(null);
    const identity = ref(null);
    const identityString = ref(null);
    const authenticatedActor = ref(null);

    const init: () => Promise<void> = async () => {
        const tempAuthClient: AuthClient = await AuthClient.create(defaultOptions.createOptions);
        authClient.value = tempAuthClient;

        isAuthenticated.value = await tempAuthClient.isAuthenticated();
        identity.value = isAuthenticated.value ? tempAuthClient.getIdentity() : null;
        authenticatedActor.value = identity.value ? actorFromIdentity(identity.value) : null;
        identityString.value = identity.value ? (await authenticatedActor.value.whoami()).toText() : null;
        isReady.value = true;
    };

    const login: () => Promise<void> = async () => {
        const tempAuthClient: AuthClient = toRaw(authClient.value);

        tempAuthClient.login({
            ...defaultOptions.loginOptions,
            onSuccess: async () => {
                isAuthenticated.value = await tempAuthClient.isAuthenticated();
                identity.value = isAuthenticated.value ? tempAuthClient.getIdentity() : null;
                authenticatedActor.value = identity.value ? actorFromIdentity(identity.value) : null;
                identityString.value = identity.value ? (await authenticatedActor.value.whoami()).toText() : null;
            },
        });
    };

    const logout: () => Promise<void> = async () => {
        await authClient.value?.logout();
        isAuthenticated.value = false;
        identity.value = null;
        identityString.value = null;
        authenticatedActor.value = null;
    };

    return {
        isReady,
        isAuthenticated,
        authClient,
        identity,
        identityString,
        authenticatedActor,
        init,
        login,
        logout,
    };
});
