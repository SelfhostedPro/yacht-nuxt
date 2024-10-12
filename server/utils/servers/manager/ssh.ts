// Import necessary modules
import { Client } from 'ssh2';
import SSH2 from 'ssh2';

// Define interface for SSH command options
export interface SSHCommandOptions {
  remoteHost: string;
  command: string;
  port: number;
  username: string;
  privateKey?: string;
  passphrase?: string;
  password?: string;
}

// Class for SSH operations
export class SSHOperations {
  // Generate a new SSH key pair
  static async generateKeyPair(passphrase: string): Promise<{ privateKey: string; publicKey: string }> {
    const newKeys = SSH2.utils.generateKeyPairSync('rsa', { bits: 4096, passphrase, cipher: 'aes256-cbc' });
    return { privateKey: newKeys.private, publicKey: newKeys.public };
  }

  // Execute a command on a remote server via SSH
  static async executeCommand(options: SSHCommandOptions): Promise<void> {
    const conn = new Client();
    return new Promise<void>((resolve, reject) => {
      conn.on('ready', () => {
        Logger.info(`Connected to ${options.remoteHost}`);
        conn.exec(options.command, (err, stream) => {
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
        .connect(SSHOperations.getConnectionOptions(options));
    });
  }

  // Helper method to get connection options based on authentication method
  private static getConnectionOptions(options: SSHCommandOptions): any {
    return options.privateKey
      ? {
          host: options.remoteHost,
          port: options.port || 22,
          username: options.username,
          privateKey: options.privateKey,
          passphrase: options.passphrase,
        }
      : {
          host: options.remoteHost,
          port: options.port || 22,
          username: options.username,
          password: options.password,
        };
  }
}