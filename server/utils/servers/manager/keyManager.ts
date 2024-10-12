// keyManager.ts
import path from 'path';
import { FileOperations } from './files';
import { Encryption } from './encryption';
import { SSHOperations } from './ssh';
import SSH2 from 'ssh2';


export interface SSHKeyInfo {
  privateKey: {
    path: string;
    value: string | null;
  },
  publicKey: {
    path: string;
    value: string | null;
  }
}

export class KeyManager {
  static async getSSHKeyInfo(keyName: string): Promise<SSHKeyInfo> {
    const privateKeyPath = path.join(configPaths.ssh, keyName);
    const publicKeyPath = `${privateKeyPath}.pub`;

    const [privateKeyValue, publicKeyValue] = await Promise.all([
      FileOperations.readFile(privateKeyPath),
      FileOperations.readFile(publicKeyPath),
    ]);

    return {
      privateKey: { path: privateKeyPath, value: privateKeyValue },
      publicKey: { path: publicKeyPath, value: publicKeyValue },
    };
  }

  static async createSSHKey(keyName: string, passphrase: string): Promise<void> {
    const { privateKey, publicKey } = await KeyManager.getSSHKeyInfo(keyName);
    if (privateKey.value && publicKey.value) {
      throw new Error('SSH key already exists');
    }

    const newKeys = await SSHOperations.generateKeyPair(passphrase);

    await Promise.all([
      FileOperations.writeFile(privateKey.path, newKeys.privateKey),
      FileOperations.writeFile(publicKey.path, newKeys.publicKey),
    ]);

    Logger.info(`SSH key ${keyName} created and saved`);

    if (!(await KeyManager.checkSavedPassphrases(keyName))) {
      const encryptedPassphrase = await Encryption.encrypt(passphrase);
      await KeyManager.writePassphraseToFile(keyName, encryptedPassphrase);
      Logger.info(`Passphrase saved for ${keyName}`);
    }
  }

  static async removeSSHKey(keyName: string): Promise<void> {
    const { privateKey, publicKey } = await KeyManager.getSSHKeyInfo(keyName);
    if (privateKey.value && publicKey.value) {
      await Promise.all([
        FileOperations.removeFile(privateKey.path),
        FileOperations.removeFile(publicKey.path),
        KeyManager.removePassphrase(keyName),
      ]);
    } else {
      Logger.error(`SSH key ${keyName} does not exist`);
    }
  }

  static async getAllKeys(): Promise<string[]> {
    const passphrases = await KeyManager.readPassphraseFile();
    return Array.from(passphrases.keys());
  }

  static async getPrivateKey(keyName: string, passphrase?: string): Promise<{ key: string; passphrase: string } | null> {
    passphrase = passphrase || await KeyManager.getSavedPassphrase(keyName);
    const { privateKey } = await KeyManager.getSSHKeyInfo(keyName);
    if (!privateKey.value) {
      return null;
    }
    const parsedKey = SSH2.utils.parseKey(privateKey.value, passphrase);
    if (parsedKey instanceof Error) {
      throw parsedKey;
    }
    return { key: parsedKey.getPrivatePEM(), passphrase };
  }

  private static async readPassphraseFile(): Promise<Map<string, string>> {
    const passphraseFile = await FileOperations.readJSON<Record<string, string>>(`${configPaths.ssh}/passphrases`);
    return new Map(Object.entries(passphraseFile || {}));
  }

  private static async getSavedPassphrase(keyName: string): Promise<string> {
    const passphrases = await KeyManager.readPassphraseFile();
    const encryptedPassphrase = passphrases.get(keyName);
    if (!encryptedPassphrase) {
      throw new Error(`No passphrase found for ${keyName}`);
    }
    return Encryption.decrypt(encryptedPassphrase);
  }

  private static async removePassphrase(keyName: string): Promise<void> {
    const passphrases = await KeyManager.readPassphraseFile();
    if (passphrases.has(keyName)) {
      passphrases.delete(keyName);
      await FileOperations.writeJSON(`${configPaths.ssh}/passphrases`, Object.fromEntries(passphrases));
    } else {
      Logger.error(`No passphrase found for ${keyName}`);
    }
  }

  private static async checkSavedPassphrases(keyName: string): Promise<boolean> {
    const passphrases = await KeyManager.readPassphraseFile();
    return passphrases.has(keyName);
  }

  private static async writePassphraseToFile(keyName: string, encryptedPassphrase: string): Promise<void> {
    const passphrases = await KeyManager.readPassphraseFile();
    passphrases.set(keyName, encryptedPassphrase);
    await FileOperations.writeJSON(`${configPaths.ssh}/passphrases`, Object.fromEntries(passphrases));
    Logger.info(`Passphrase saved for ${keyName} in ${configPaths.ssh}/passphrases`);
  }
}