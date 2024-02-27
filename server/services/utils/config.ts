import { YachtConfigSchema, type YachtConfig, type YachtConfigFull } from "~/types/config";
import yaml from 'js-yaml'
import * as crypto from 'crypto';

import { createConsola } from 'consola'
export class ConfigService {
    public config?: YachtConfig
    public secrets?: YachtConfigFull['secrets']
    public paths: YachtConfigFull['static']['paths'] = {
        config: process.env.CONFIG_FILE || 'config.yml',
        secrets: process.env.SECRETS_FILE || '.secrets.json',
        ssh: process.env.SSH_PATH || '.ssh/',
        auth: process.env.AUTH_PATH || '.auth/',
        backups: {
            config: process.env.BACKUP_CONFIG_PATH || 'backups/config',
            instance: process.env.BACKUP_INSTANCE_PATH || 'backups/instance'
        },
        templates: process.env.TEMPLATE_PATH || 'templates/'
    }

    private storage
    private logger

    constructor() {
        this.storage = useStorage('base')
        this.logger = createConsola({ fancy: true, level: 3 }).withTag('service:config')
    }

    public async build () {
        const _this = new ConfigService()
        _this.config = await this.get()
        return _this
    }

    private async get() {
        const configFile = await this.storage.getItem('config.yml')
        if (configFile) {
            const config = await this.validate(yaml.load(configFile.toString() || "") as YachtConfig)
            this.config = config
            this.secrets = await this.getSecrets()
            return {
                ...config,
                secrets: this.secrets,
                static: {
                    paths: this.paths
                }
            } as YachtConfigFull

        }
    }
    private validate = async (config: YachtConfig): Promise<YachtConfig> => {
        try {
            return YachtConfigSchema.parse(config)
        } catch (e) {
            this.logger.warn(`Config at ${useStorage().getMount('config').base}/config.yml is invalid! Backing up and replacing with default...`)
            await this.backup(config)
            return await this.create()
        }
    }
    private async backup(config: YachtConfig) {
        await this.storage.setItem('config.yml.bak', yaml.dump(config), {})
    }
    private create = async (): Promise<YachtConfig> => {
        await this.storage.setItem('config.yml', yaml.dump(this.default), {})
        return this.default
    }
    private async getSecrets(): Promise<YachtConfigFull['secrets']> {
        const secrets = await this.storage.getItem<YachtConfigFull['secrets']>(this.paths.secrets);
        if (secrets && typeof secrets === 'object') {
            try {
                if (!secrets.accessSecret || !secrets.refreshSecret || !secrets.passphraseSecret || !secrets.authSecret) {
                    return this.generateSecrets();
                } else return secrets;
            } catch (e) {
                return this.generateSecrets();
            }
        } else return this.generateSecrets();
    }
    private generateSecrets(): YachtConfigFull['secrets'] {
        const secrets = {
            authSecret: crypto.randomBytes(256).toString('base64'),
            accessSecret: crypto.randomBytes(256).toString('base64'),
            refreshSecret: crypto.randomBytes(256).toString('base64'),
            passphraseSecret: {
                key: crypto.randomBytes(32).toString('base64'),
                iv: crypto.randomBytes(16).toString('base64'),
            },
        };

        // Write the secrets to a file
        this.storage.setItem<YachtConfigFull['secrets']>(this.paths.secrets, secrets);
        return secrets;
    }

    private default: YachtConfig = {
        name: 'Yacht',
        servers: [
            {
                name: 'local',
                options: {
                    socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock',
                },
            },
        ],
        auth: true,
        theme: {
            type: 'dark',
        },
        plugins: [],
        sessionTimeout: 3600,
    };
}