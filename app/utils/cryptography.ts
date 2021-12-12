import * as Crypto from 'expo-crypto';

/** MD5 hash */
export async function hash(input: string) {
    return Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.MD5,
        input
      );
}