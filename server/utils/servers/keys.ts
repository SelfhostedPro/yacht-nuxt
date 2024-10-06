import { generateKeyPairSync } from 'crypto';
import { createCipheriv, createDecipheriv } from 'crypto';
import * as sshpk from 'sshpk';
import * as path from 'path';
import { Client } from 'ssh2';
import fs from 'fs-extra'

import { checkConfig, configPaths, useConfig } from '~~/modules/config/runtime/server/utils/config';


type PassphraseFile = Map<string, string>;

interface SSHKeyInfo {
    privateKey: {
        path: string;
        value: string | null;
    },
    publicKey: {
        path: string;
        value: string | null;
    }
}

// Generate an SSH key
export const createSSHKey = async (keyName: string, passphrase: string) => {
    // Check if key already exists
    const { privateKey, publicKey } = await getSSHKeyInfo(keyName)
    if (privateKey.value && publicKey.value) {
        createError('SSH key already exists')
        return;
    }

    // If not, generate a new key pair
    const newKeys = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: passphrase,
        },
    });

    // Save the keys to the filesystem
    await useStorage('base').setItem(privateKey.path, newKeys.privateKey);
    await useStorage('base').setItem(publicKey.path, newKeys.publicKey);
    Logger.info(`SSH key ${keyName} created`);

    // Save the passphrase to a file if requested
    if (!(await checkSavedPassphrases(keyName))) {
        Logger.info(`Saving passphrase for ${keyName}`);
        const encryptedPassphrase = await encryptPassphrase(passphrase);
        await writePassphraseToFile(keyName, encryptedPassphrase);
    }
}

export const removeSSHKey = async (keyName: string): Promise<void> => {
    const { privateKey, publicKey } = await getSSHKeyInfo(keyName);
    if (privateKey.value && publicKey.value) {
        await Promise.all([
            useStorage('base').removeItem(privateKey.path),
            useStorage('base').removeItem(publicKey.path),
            removePassphrase(keyName),
        ]);
    } else {
        Logger.error('SSH key does not exist');
    }
}

export const removePublicKeyFromRemoteServer = async (
    keyName: string,
    remoteHost: string,
    port: string | number,
    username: string,
): Promise<void> => {
    const { publicKey, privateKey } = await getSSHKeyInfo(keyName);
    if (!publicKey.value || privateKey.value) {
        Logger.warn('SSH key does not exist');
        return;
    }
    const decryptedPrivateKey = await getPrivateKey(keyName);
    const conn = new Client();
    // Remove public key from remote server
    Logger.info(`Removing SSH key from ${remoteHost}`);
    await new Promise<void>((resolve, reject) => {
        conn
            .on('ready', async () => {
                Logger.info(`Connected to ${remoteHost}`);
                conn.exec(
                    `sed -i '/${publicKey}/d' ~/.ssh/authorized_keys`,
                    (err, stream) => {
                        if (err) reject(err);
                        stream
                            .on('close', () => {
                                Logger.info('SSH key removed');
                                conn.end();
                                resolve();
                            })
                            .on('data', (data: string) => {
                                Logger.info('STDOUT: ' + data);
                            })
                            .stderr.on('data', (data: string) => {
                                Logger.error('STDERR: ' + data);
                            });
                    },
                );
            })
            .on('error', (err) => {
                Logger.error(`Connection error: \${err}`);
                reject(err);
            })
            .connect({
                host: remoteHost,
                port: Number(port),
                username: username,
                privateKey: decryptedPrivateKey,
            });
    });
}

export const copyPublicKeyToRemoteServer = async (
    keyName: string,
    remoteHost: string,
    port: string | number,
    username: string,
    password: string,
): Promise<void> => {
    // Get ssh public key
    const { publicKey } = await getSSHKeyInfo(keyName);
    if (!publicKey.value) {
        createError('SSH key does not exist')
        return;
    }
    const convertedPublicKey = sshpk.parseKey(publicKey.value, 'pem').toString('ssh');
    const conn = new Client();
    // Copy the public key to the remote server
    Logger.info(`Copying SSH key to ${remoteHost}`);
    await new Promise<void>((resolve, reject) => {
        conn
            .on('ready', async () => {
                Logger.info(`Connected to ${remoteHost}`);
                conn.exec(
                    `mkdir -p ~/.ssh/ && echo "${convertedPublicKey}" >> ~/.ssh/authorized_keys`,
                    (err, stream) => {
                        if (err) reject(err);
                        stream
                            .on('close', () => {
                                Logger.info('SSH key copied');
                                conn.end();
                                resolve();
                            })
                            .on('data', (data: string) => {
                                Logger.info('STDOUT: ' + data);
                            })
                            .stderr.on('data', (data) => {
                                Logger.error('STDERR: ' + data);
                            });
                    },
                );
            })
            .on('error', (err) => {
                Logger.error(`Connection error: \${err}`);
                reject(err);
            })
            .connect({
                host: remoteHost,
                port: Number(port),
                username: username,
                password: password,
            })
    });
}

export const getAllKeys = async (): Promise<string[]> => {
    const passphrases = await readPassphraseFile();
    return Array.from(passphrases.keys());
}

export const getPrivateKey = async (keyName: string, passphrase?: string) => {
    passphrase = passphrase || (await getSavedPassphrase(keyName));
    const { privateKey } = await getSSHKeyInfo(keyName);
    if (!privateKey.value) {
        createError('SSH key does not exist')
        return;
    }
    // Decrypt and return the private key
    return sshpk.parsePrivateKey(privateKey.value, 'pem', {
        passphrase: passphrase,
    }).toString('ssh-private');
}

const getSSHKeyInfo = async (keyName: string): Promise<SSHKeyInfo> => {
    const privateKeyPath = path.join(configPaths.ssh, keyName);
    const publicKeyPath = `${privateKeyPath}.pub`;

    const [privateKey, publicKey] = await Promise.all([
        useStorage('base').getItem<string>(privateKeyPath).then(
            (value) => ({ path: privateKeyPath, value }),
            () => ({ path: privateKeyPath, value: null }),
        ),
        useStorage('base').getItem<string>(publicKeyPath).then(
            (value) => ({ path: privateKeyPath, value }),
            () => ({ path: privateKeyPath, value: null }),
        )
    ]);
    return { privateKey, publicKey };
}

const readPassphraseFile = async (): Promise<PassphraseFile> => {
    const passphraseFile = await fs.readJSON(`${configPaths.ssh}/passphrases`) as PassphraseFile
    if (!passphraseFile || typeof passphraseFile !== 'object') {
        return new Map();
    }
    const passphrases = passphraseFile;
    return new Map(Object.entries(passphrases));
}

const getSavedPassphrase = async (keyName: string): Promise<string> => {
    const passphrases = await readPassphraseFile();
    const encryptedPassphrase = passphrases.get(keyName);
    if (!encryptedPassphrase) {
        Logger.error(`No passphrase found for ${keyName}`);
        return '';
    }
    const passphrase = decryptPassphrase(encryptedPassphrase);
    return passphrase;
}

const removePassphrase = async (keyName: string): Promise<void> => {
    const passphrases = await readPassphraseFile();
    const currentPassphrase = passphrases.get(keyName);
    if (currentPassphrase) {
        passphrases.delete(keyName);
        fs.outputJSON(`${configPaths.ssh}/passphrases`, Object.fromEntries(passphrases))
    } else {
        Logger.error(`No passphrase found for ${keyName}`);

    }

}

const checkSavedPassphrases = async (keyName: string): Promise<boolean> => {
    const passphrases = await readPassphraseFile();
    return passphrases.has(keyName);
}

const writePassphraseToFile = async (
    keyName: string,
    encryptedPassphrase: string,
): Promise<void> => {
    const passphraseFile = await fs.readJSON(`${configPaths.ssh}/passphrases`) as PassphraseFile
    if (passphraseFile) {
        passphraseFile.set(keyName, encryptedPassphrase);
    }
    fs.outputJSON(`${configPaths.ssh}/passphrases`, passphraseFile)
}

const encryptPassphrase = async (passphrase: string): Promise<string> => {
    const config = await useConfig()
    if (!config.secrets) {
        checkConfig()
        throw createError('Config secrets not created. Checking config.')
    }
    const encrypt = createCipheriv(
        'aes-256-cbc',
        Buffer.from(config.secrets.passphraseSecret.key, 'base64'),
        Buffer.from(config.secrets.passphraseSecret.iv, 'base64'),
    );
    return encrypt.update(passphrase, 'utf8', 'hex') + encrypt.final('hex');
}
const decryptPassphrase = async (name: string): Promise<string> => {
    const config = await useConfig()
    if (!config.secrets) {
        checkConfig()
        throw createError('Config secrets not created. Checking config.')
    }
    const decrypt = createDecipheriv(
        'aes-256-cbc',
        Buffer.from(config.secrets.passphraseSecret.key, 'base64'),
        Buffer.from(config.secrets.passphraseSecret.iv, 'base64'),
    );
    return decrypt.update(name, 'hex', 'utf8') + decrypt.final('utf8');
}
