import { YachtConfigSchema, type YachtConfig } from '~/types/config';
import { configPaths, defaultConfig } from './variables';

import yaml from 'js-yaml'
import * as crypto from 'crypto';

// Interfaces
interface YachtBackendConfig extends YachtConfig {
    secrets: {
        accessSecret: string;
        refreshSecret: string;
        passphraseSecret: {
            key: string;
            iv: string;
        };
    },
    static: {
        paths: typeof configPaths
    }
}

// Loaded Config Cache
let _config: YachtBackendConfig

const logger = useLog('services:config')

// setup storage
const configStorage = useStorage('base')

export const useConfig = async (): Promise<YachtBackendConfig> => {
    if (!_config) {
        _config = await getConfig()
    }
    return _config
}

const getConfig = async (): Promise<YachtBackendConfig> => {
    const configFile = await configStorage.getItem('config.yml')
    if (configFile) {
        const _config = yaml.load(configFile?.toString() || "") as YachtConfig
        const isValid = await validateConfig(_config)
        if (isValid) {
            const config: YachtBackendConfig = {
                ..._config,
                secrets: await getSecrets(),
                static: {
                    paths: configPaths
                }
            }
            return config
        } else {
            logger.warn(`Config at ${useStorage().getMount('config').base}/config.yml is invalid! Backing up and replacing with default...`)
            await backupConfig(_config)
            return await createConfig()
        }
    } else {
        logger.warn(`Config at ${useStorage().getMount('config').base}/config.yml not found! Creating new config...`)
        return await createConfig()
    }
}



const backupConfig = async (oldConfig: YachtConfig) => {
    await configStorage.setItem('config.yml.bak', yaml.dump(oldConfig), {})
}

const validateConfig = async (config: YachtConfig) => {
    return (await YachtConfigSchema.safeParseAsync(config)).success
}

const createConfig = async () => {
    await configStorage.setItem('config.yml', yaml.dump(defaultConfig), {})
    _config = {
        ...defaultConfig,
        secrets: await getSecrets(),
        static: {
            paths: configPaths
        }
    }
    _config.base = defaultConfig.base
    logger.info(`New config created at: ${useStorage().getMount('config').base}/config.yml`)
    return _config
}

const getSecrets = async () => {
    const secrets = await configStorage.getItem<YachtBackendConfig['secrets']>(configPaths.secrets)
    if (secrets && typeof secrets === 'object') {
        try {
            if (!secrets.accessSecret || !secrets.refreshSecret || !secrets.passphraseSecret) {
                return generateSecretTokens()
            } else return secrets
        } catch (e) {
            return generateSecretTokens();
        }
    } else return generateSecretTokens();
}

/**
 * Generates the secret token for signing JWTs
 */
const generateSecretTokens = () => {
    const secrets = {
        accessSecret: crypto.randomBytes(256).toString('base64'),
        refreshSecret: crypto.randomBytes(256).toString('base64'),
        passphraseSecret: {
            key: crypto.randomBytes(32).toString('base64'),
            iv: crypto.randomBytes(16).toString('base64'),
        },
    };

    // Write the secrets to a file
    configStorage.setItem<YachtBackendConfig['secrets']>(configPaths.secrets, secrets)
    return secrets;
}