import { createCipheriv, createDecipheriv } from 'crypto';
import * as path from 'path';
import { Client } from 'ssh2';
import SSH2 from 'ssh2';
import fs from 'fs-extra'

import { checkConfig, configPaths, useConfig } from '~~/modules/config/runtime/server/utils/config';

type PassphraseFile = Map<string, string>;

interface SSHCommandOptions {
    remoteHost: string;
    command: string;
    port: number;
    username: string;
    privateKey?: string;
    passphrase?: string;
    password?: string;
}

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

const initPassphraseFile = async () => {
    fs.ensureDirSync(`${configPaths.ssh}`)
    fs.writeFileSync(`${configPaths.ssh}/passphrases`, '')
    return
}

// Generate an SSH key
export const createSSHKey = async (keyName: string, passphrase: string): Promise<void> => {
    try {
        const { privateKey, publicKey } = await getSSHKeyInfo(keyName);
        if (privateKey.value && publicKey.value) {
            throw createError({
                statusCode: 400,
                statusMessage: 'SSH key already exists'
            });
        }
        const newKeys = SSH2.utils.generateKeyPairSync('rsa', { bits: 4096, passphrase, cipher: 'aes256-cbc' })

        const parsedKey = SSH2.utils.parseKey(newKeys.private, passphrase)
        if (parsedKey instanceof Error) throw createError(parsedKey)

        await Promise.all([
            fs.writeFile(privateKey.path, newKeys.private),
            fs.writeFile(publicKey.path, newKeys.public)
        ]);

        Logger.info(`SSH key ${keyName} created and saved`);

        if (!(await checkSavedPassphrases(keyName))) {
            const encryptedPassphrase = await encryptPassphrase(passphrase);
            await writePassphraseToFile(keyName, encryptedPassphrase);
            Logger.info(`Passphrase saved for ${keyName}`);
        }
    } catch (error) {
        Logger.error(`Error creating SSH key: ${error}`);
        throw error;
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
        Logger.error(`SSH key ${keyName} does not exist`);
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
        Logger.error(`SSH key ${keyName} does not exist`);
        return;
    }
    const decryptedPrivateKey = await getPrivateKey(keyName);
    // Remove public key from remote server
    Logger.info(`Removing SSH key from ${remoteHost}`);
    await executeSSHCommand({
        remoteHost,
        command: `sed -i '/${publicKey.value}/d' ~/.ssh/authorized_keys`,
        port: Number(port),
        username,
        privateKey: decryptedPrivateKey?.key,
        passphrase: decryptedPrivateKey?.passphrase
    }
    );
}

export const copyPublicKeyToRemoteServer = async (
    keyName: string,
    remoteHost: string,
    port: string | number,
    username: string,
    password: string,
): Promise<void> => {
    // Get ssh public key
    const { privateKey, publicKey } = await getSSHKeyInfo(keyName);
    if (!privateKey.value) {
        createError('SSH key does not exist')
        return;
    }
    // Copy the public key to the remote server
    Logger.info(`Copying SSH key to ${remoteHost}`);
    await executeSSHCommand(
        {
            remoteHost,
            command: `mkdir -p ~/.ssh/ && echo "${publicKey.value}" >> ~/.ssh/authorized_keys`,
            port: Number(port),
            username,
            password
        }
    );
}

export const getAllKeys = async (): Promise<string[]> => {
    const passphrases = await readPassphraseFile();
    return Array.from(passphrases.keys());
}

export const getPrivateKey = async (keyName: string, passphrase?: string) => {
    passphrase = passphrase || (await getSavedPassphrase(keyName));
    const { privateKey, publicKey } = await getSSHKeyInfo(keyName);
    if (!privateKey.value) {
        createError('SSH key does not exist')
        return;
    }
    const parsedKey = SSH2.utils.parseKey(privateKey.value, passphrase)
    if (parsedKey instanceof Error) {
        throw createError(parsedKey)
    }
    const privateKeyPEM = parsedKey.getPrivatePEM()

    // Decrypt and return the private key
    return { key: privateKeyPEM, passphrase: passphrase };
}

const getSSHKeyInfo = async (keyName: string): Promise<SSHKeyInfo> => {
    const privateKeyPath = path.join(configPaths.ssh, keyName);
    const publicKeyPath = `${privateKeyPath}.pub`;

    const privateKey = { path: privateKeyPath, value: await fs.readFile(privateKeyPath, { encoding: 'utf8' }).catch(() => null) }
    const publicKey = { path: publicKeyPath, value: await fs.readFile(publicKeyPath, { encoding: 'utf8' }).catch(() => null) }

    // const [privateKey, publicKey] = await Promise.all([
    //     fs.readFile(privateKeyPath, { encoding: 'utf8' }).then(
    //         (value) => ({ path: privateKeyPath, value }),
    //         () => ({ path: privateKeyPath, value: null }),
    //     ),
    //     fs.readFile(publicKeyPath, { encoding: 'utf8' }).then(
    //         (value) => ({ path: publicKeyPath, value }),
    //         () => ({ path: publicKeyPath, value: null }),
    //     )
    // ]);
    return { privateKey, publicKey };
}

const readPassphraseFile = async (): Promise<PassphraseFile> => {
    await fs.ensureFile(`${configPaths.ssh}/passphrases`)
    const passphraseFile = await fs.readJSON(`${configPaths.ssh}/passphrases`, { throws: false }) as PassphraseFile | undefined
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
    const passphraseFile = await readPassphraseFile();
    if (passphraseFile) {
        passphraseFile.set(keyName, encryptedPassphrase);
    }
    fs.outputJSON(`${configPaths.ssh}/passphrases`, Object.fromEntries(passphraseFile))
    Logger.info(`Passphrase saved for ${keyName} in ${configPaths.ssh}/passphrases`);
}

const encryptPassphrase = async (passphrase: string): Promise<string> => {
    const { key, iv } = await getCipherKeyAndIV()
    const encrypt = createCipheriv(
        'aes-256-cbc',
        key,
        iv
    );
    return encrypt.update(passphrase, 'utf8', 'hex') + encrypt.final('hex');
}
const decryptPassphrase = async (name: string): Promise<string> => {
    const { key, iv } = await getCipherKeyAndIV()
    const decrypt = createDecipheriv(
        'aes-256-cbc',
        key,
        iv,
    );
    return decrypt.update(name, 'hex', 'utf8') + decrypt.final('utf8');
}



const executeSSHCommand = async (
    {
        remoteHost,
        command,
        port,
        username,
        privateKey,
        passphrase,
        password
    }: SSHCommandOptions
): Promise<void> => {
    const conn = new Client();
    return new Promise<void>((resolve, reject) => {
        conn.on('ready', () => {
            Logger.info(`Connected to ${remoteHost}`);
            conn.exec(command, (err, stream) => {
                if (err) reject(err);
                stream
                    .on('close', () => {
                        Logger.info('SSH command executed');
                        conn.end();
                        resolve();
                    })
                    .on('data', (data: string) => Logger.info('STDOUT: ' + data))
                    .stderr.on('data', (data: string) => Logger.error('STDERR: ' + data));
            });
        })
            .on('error', (err) => {
                Logger.error(`Connection error: ${err}`);
                reject(err);
            })
            .connect(
                privateKey !== undefined ? {
                    host: remoteHost,
                    port: port || 22,
                    username,
                    privateKey: privateKey || undefined,
                    passphrase: passphrase || undefined,
                } : {
                    host: remoteHost,
                    port: port || 22,
                    username,
                    password: password
                });
    });
}

const getCipherKeyAndIV = async (): Promise<{ key: Buffer, iv: Buffer }> => {
    const secrets = await getSecrets();
    if (!secrets) {
        await checkConfig();
        throw createError({
            statusCode: 500,
            statusMessage: 'Config secrets not created. Checking config.'
        });
    }
    return {
        key: Buffer.from(secrets.passphraseSecret.key, 'base64'),
        iv: Buffer.from(secrets.passphraseSecret.iv, 'base64')
    };
}
