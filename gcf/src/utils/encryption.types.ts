export type EncryptWrapper = (
    b64Plaintext: string,
    inputEncoding?: BufferEncoding
) => Promise<string>;

export type DecryptWrapper = (
    b64Cipher: string,
    outputEncoding?: BufferEncoding
) => Promise<string>;

export interface Encryption {
    encrypt: EncryptWrapper;
    decrypt: DecryptWrapper;
}

export type HexBase64Encoding = 'base64' | 'hex';
