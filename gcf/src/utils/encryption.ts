import { getSecret } from '@root/utils/getSecret';
import crypto from 'crypto';
import { EncryptWrapper, DecryptWrapper, Encryption, HexBase64Encoding } from './encryption.types';

const AES_IV_LENGTH = 16;
const AES_AUTH_TAG_LENGTH = 16;
const AES_DEFAULT_ALGO = 'aes-256-gcm' as crypto.CipherGCMTypes;

function makeAesEncryptor(keySecretName: string): Encryption {
    const aesEncrypt: EncryptWrapper = async (b64Plaintext, inputEncoding) => {
        const key = await getSecret(keySecretName);
        const iv = crypto.randomBytes(AES_IV_LENGTH);
        const plaintext = Buffer.from(b64Plaintext, inputEncoding);
        const cipher = crypto.createCipheriv(AES_DEFAULT_ALGO, Buffer.from(key, 'base64'), iv, {
            authTagLength: AES_AUTH_TAG_LENGTH,
        });

        const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        const outputBuffer = Buffer.concat([ciphertext, iv, cipher.getAuthTag()]);
        return outputBuffer.toString('base64');
    };

    const aesDecrypt: DecryptWrapper = async (b64Cipher, outputEncoding) => {
        const key = await getSecret(keySecretName);
        const ciphertextWithEncoding = Buffer.from(b64Cipher, 'base64');

        // Separate the bytes into its parts
        const ciphertext = Buffer.alloc(
            ciphertextWithEncoding.length - AES_IV_LENGTH - AES_AUTH_TAG_LENGTH
        );
        ciphertextWithEncoding.copy(ciphertext, 0, 0);
        const iv = Buffer.alloc(AES_IV_LENGTH);
        ciphertextWithEncoding.copy(iv, 0, ciphertext.length);
        const authTag = Buffer.alloc(AES_AUTH_TAG_LENGTH);
        ciphertextWithEncoding.copy(authTag, 0, ciphertext.length + iv.length);

        const decipher = crypto.createDecipheriv(AES_DEFAULT_ALGO, Buffer.from(key, 'base64'), iv);
        decipher.setAuthTag(authTag);
        return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
            outputEncoding
        );
    };

    return {
        encrypt: aesEncrypt,
        decrypt: aesDecrypt,
    };
}

export function calculateHash(input: string, encoding: HexBase64Encoding = 'base64') {
    return crypto.createHash('sha256').update(input).digest(encoding);
}

export function calculateHmac(input: string, key: string, encoding: HexBase64Encoding = 'base64') {
    return crypto.createHmac('sha256', key).update(input).digest(encoding);
}

export const aes: Encryption = makeAesEncryptor('aesKey');
