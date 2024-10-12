// Import necessary crypto functions
import { createCipheriv, createDecipheriv } from 'crypto';

// Encryption class for handling data encryption and decryption
export class Encryption {
  // Private method to retrieve cipher key and initialization vector
  private static async getCipherKeyAndIV(): Promise<{ key: Buffer; iv: Buffer }> {
    const secrets = await getSecrets();
    if (!secrets) {
      throw new Error('Config secrets not created');
    }
    return {
      key: Buffer.from(secrets.passphraseSecret.key, 'base64'),
      iv: Buffer.from(secrets.passphraseSecret.iv, 'base64'),
    };
  }

  // Encrypt the provided data using AES-256-CBC
  static async encrypt(data: string): Promise<string> {
    const { key, iv } = await Encryption.getCipherKeyAndIV();
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    // Encrypt the data and return as hex string
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }

  // Decrypt the provided encrypted data
  static async decrypt(data: string): Promise<string> {
    const { key, iv } = await Encryption.getCipherKeyAndIV();
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    // Decrypt the data and return as UTF-8 string
    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
  }
}