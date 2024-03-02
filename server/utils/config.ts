import { watchConfig, type ConfigWatcher } from 'c12'
import { stringifyYAML } from 'confbox'
import { outputFile, exists } from 'fs-extra'
import { resolve } from 'path'
import { ZodError } from 'zod'
import * as crypto from 'crypto';


// Importing from relative dir so the user can change these easily.
import { YachtConfigFullSchema, type YachtConfigFull, DefaultConfig, type YachtSecrets } from '~/types/config'

const logger = useLog('config')

// Watching the config file to auto reload changes.
export const _config = watchConfig({
    // If running in production (which the docker container does), 
    // then check a directory above where we're running in order to have 
    // the config at /config in the docker container for easy mounting.
    cwd: process.env.NODE_ENV === 'production' ? '../config' : './config',
    configFile: 'config.yaml',
    chokidarOptions: { ignoreInitial: false },
    defaults: DefaultConfig,
    extend: {
        extendKey: '.secrets.json'
    },

    // TODO: find a way we can have users extend these functions.
    // These don't seem to work well during development but custom logic can be implemented in order to manage these.
    onWatch: ({ path, type }) => {
        logger.log(`Config ${type} at ${path}`)
        if (type === 'removed') {
            checkConfig()
        }
    },
    onUpdate: ({ getDiff }) => {
        logger.log(getDiff())
    }
})

// setup storage
const configStorage = useStorage('base')

export const useConfig = async () => {
    const config = await _config
    if (!config.config) {
        checkConfig()
        throw createError('No config found, creating a fresh config')
    }
    // config.config.secrets = await getSecrets()
    return config.config
}

// Get raw config file instead of config values.
const _useConfig = async () => {
    const config = await _config
    if (!config.config) {
        checkConfig()
        throw createError('No config found, creating a fresh config')
    }
    // config.config.secrets = await getSecrets()
    return config
}

const backupConfig = async (config: any, path: string) => {
    outputFile(resolve(path, 'config.bak.yaml'), stringifyYAML(config, { indent: 2 }), { encoding: 'utf8' })
}

export const updateConfig = async (config: YachtConfigFull, path: string) => {
    // Validate the config before writing it.
    try {
        YachtConfigFullSchema.parse(config) as YachtConfigFull
        outputFile(resolve(path, 'config.yaml'), stringifyYAML(config, { indent: 2 }), { encoding: 'utf8' })
    } catch (e) {
        if (e instanceof ZodError) {
            throw createError({ ...e })
        } else {
            throw createError('unknown error writing config.')
        }
    }
}

// Check to make sure the config exists. If it doesn't write a new default one.
export const checkConfig = async () => {
    const config = await _useConfig()
    if (!config.cwd) throw createError(`No directory defined for config`)
    const configExists = await exists(resolve(config.cwd, 'config.yaml'))
    if (!configExists || !config.config) {
        logger.log(`No config exists at ${config.cwd}, creating default config.`)
        updateConfig(DefaultConfig, config.cwd)
    } else {
        try {
            // If the config exists, validate it.
            config.config.secrets = await getSecrets()
            YachtConfigFullSchema.parse(config.config) as YachtConfigFull
            logger.log(`Valid config exists at ${config.cwd}.`)
        } catch (e) {
            if (e instanceof ZodError) {
                // If it's not valid, write a fresh one and throw an error.
                // backupConfig(config.config, config.cwd)
                updateConfig(DefaultConfig, config.cwd)
                throw createError({ ...e })
            } else {
                throw createError('unknown error validating config.')
            }
        }
    }
    return
}


export const getSecrets = async () => {
    const config = await useConfig()

    const secrets = await configStorage.getItem<YachtSecrets>(config.paths.secrets)
    if (secrets && typeof secrets === 'object') {
        try {
            if (!secrets.accessSecret || !secrets.refreshSecret || !secrets.passphraseSecret || !secrets.authSecret) {
                return await generateSecretTokens()
            } else return secrets
        } catch (e) {
            return await generateSecretTokens();
        }
    } else return await generateSecretTokens();
}

/**
 * Generates the secret token for signing JWTs
 */
const generateSecretTokens = async () => {
    const config = await useConfig()
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
    configStorage.setItem<YachtSecrets>(config.paths.secrets, secrets)
    return secrets;
}