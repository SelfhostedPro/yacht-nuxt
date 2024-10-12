// Import necessary modules
import { KeyManager } from './keyManager';
import { SSHOperations } from './ssh';

// Export functions from KeyManager
export const createSSHKey = KeyManager.createSSHKey;
export const removeSSHKey = KeyManager.removeSSHKey;
export const getAllKeys = KeyManager.getAllKeys;
export const getPrivateKey = KeyManager.getPrivateKey;

// Function to remove a public key from a remote server
export const removePublicKeyFromRemoteServer = async (
  keyName: string,
  remoteHost: string,
  port: string | number,
  username: string,
): Promise<void> => {
  // Get the public key information
  const { publicKey } = await KeyManager.getSSHKeyInfo(keyName);
  if (!publicKey.value) {
    Logger.error(`SSH key ${keyName} does not exist`);
    return;
  }
  
  // Get the decrypted private key
  const decryptedPrivateKey = await KeyManager.getPrivateKey(keyName);
  if (!decryptedPrivateKey) {
    throw new Error('Failed to decrypt private key');
  }
  
  // Execute command to remove the public key from the remote server
  Logger.info(`Removing SSH key from ${remoteHost}`);
  await SSHOperations.executeCommand({
    remoteHost,
    command: `sed -i '/${publicKey.value}/d' ~/.ssh/authorized_keys`,
    port: Number(port),
    username,
    privateKey: decryptedPrivateKey.key,
    passphrase: decryptedPrivateKey.passphrase,
  });
}

// Function to copy a public key to a remote server
export const copyPublicKeyToRemoteServer = async (
  keyName: string,
  remoteHost: string,
  port: string | number,
  username: string,
  password: string,
): Promise<void> => {
  // Get the public key information
  const { publicKey } = await KeyManager.getSSHKeyInfo(keyName);
  if (!publicKey.value) {
    throw new Error('SSH key does not exist');
  }
  
  // Execute command to copy the public key to the remote server
  Logger.info(`Copying SSH key to ${remoteHost}`);
  await SSHOperations.executeCommand({
    remoteHost,
    command: `mkdir -p ~/.ssh/ && echo "${publicKey.value}" >> ~/.ssh/authorized_keys`,
    port: Number(port),
    username,
    password,
  });
}