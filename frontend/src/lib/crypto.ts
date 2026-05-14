/**
 * E2E Encryption using Web Crypto API
 * Flow:
 * 1. Generate ECDH Key Pair
 * 2. Exchange Public Key with peer via socket
 * 3. Derive Shared Secret using ECDH
 * 4. Encrypt/Decrypt messages using AES-GCM with derived secret
 */

export const generateKeyPair = async (): Promise<CryptoKeyPair> => {
    return window.crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        true, // extractable for session persistence
        ["deriveKey", "deriveBits"]
    );
};

export const exportPublicKey = async (key: CryptoKey): Promise<string> => {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

export const importPublicKey = async (keyData: string): Promise<CryptoKey> => {
    const binaryDerString = window.atob(keyData);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    return window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        true, // Make extractable to avoid exportKey errors
        []
    );
};

export const deriveSharedSecret = async (
    privateKey: CryptoKey,
    publicKey: CryptoKey
): Promise<CryptoKey> => {
    return window.crypto.subtle.deriveKey(
        {
            name: "ECDH",
            public: publicKey,
        },
        privateKey,
        {
            name: "AES-GCM",
            length: 256,
        },
        true, // extractable for session persistence
        ["encrypt", "decrypt"]
    );
};

export const encryptMessage = async (
    secretKey: CryptoKey,
    content: string
): Promise<{ ciphertext: string; iv: string }> => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedContent = new TextEncoder().encode(content);

    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        secretKey,
        encodedContent
    );

    return {
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
    };
};

export const decryptMessage = async (
    secretKey: CryptoKey,
    ciphertext: string,
    iv: string
): Promise<string> => {
    const binaryCiphertext = new Uint8Array(
        atob(ciphertext)
            .split("")
            .map((c) => c.charCodeAt(0))
    );
    const binaryIv = new Uint8Array(
        atob(iv)
            .split("")
            .map((c) => c.charCodeAt(0))
    );

    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: binaryIv,
        },
        secretKey,
        binaryCiphertext
    );

    return new TextDecoder().decode(decrypted);
};

export const exportKeyPair = async (keyPair: CryptoKeyPair) => {
    const publicKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
    return { publicKey, privateKey };
};

export const importKeyPair = async (jwk: { publicKey: JsonWebKey; privateKey: JsonWebKey }): Promise<CryptoKeyPair> => {
    const publicKey = await window.crypto.subtle.importKey(
        "jwk",
        jwk.publicKey,
        { name: "ECDH", namedCurve: "P-256" },
        true,
        []
    );
    const privateKey = await window.crypto.subtle.importKey(
        "jwk",
        jwk.privateKey,
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveKey", "deriveBits"]
    );
    return { publicKey, privateKey };
};

export const exportSecretKey = async (key: CryptoKey): Promise<JsonWebKey> => {
    return window.crypto.subtle.exportKey("jwk", key);
};

export const importSecretKey = async (jwk: JsonWebKey): Promise<CryptoKey> => {
    return window.crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
};
