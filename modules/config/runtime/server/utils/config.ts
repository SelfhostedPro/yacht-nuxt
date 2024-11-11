import { watchConfig } from "c12"
import { defaultYachtConfig } from "./defaults"
import fs from 'fs-extra'
import { stringifyYAML } from 'confbox'
import { resolve , join } from 'path'
import { YachtConfigSchema, type YachtConfig } from "../../../types"
import { ZodError } from "zod"
import type { ConfigSecrets } from "../../../types/secrets"
import * as crypto from 'crypto';


const nuxtConfig = useRuntimeConfig()

// const configStorage = useStorage('config')
// const dataStorage = useStorage('data')

const DefaultWatchOptions = {
    cwd: nuxtConfig.yacht.configOptions.configPath,
    configFile: 'config.yaml',
    chokidarOptions: { ignoreInitial: false },
    defaults: defaultYachtConfig
}


const _config = watchConfig({
    ...DefaultWatchOptions,
    onWatch() {

    },
    onUpdate() {

    }
})

export const configPaths = {
    secrets: join(nuxtConfig.yacht.configOptions.configPath, '.secrets.json'),
    ssh: join(nuxtConfig.yacht.configOptions.configPath, '.ssh/'),
    auth: join(nuxtConfig.yacht.configOptions.configPath, '.auth/'),
    backups: {
        config: join(nuxtConfig.yacht.configOptions.configPath, 'backups/config/'),
        instance: join(nuxtConfig.yacht.configOptions.configPath, 'backups/instance/')
    },
    templates: join(nuxtConfig.yacht.configOptions.configPath, 'templates/')
}

const useRawConfig = async () => {
    const config = await _config
    if (!config.config) {
        throw createError('no config found, creating a fresh config')
    }
    return config
}

export const useConfig = async (): Promise<YachtConfig> => {
    const config = await useRawConfig()
    if (!config.config) {
        throw createError('no config found, creating a fresh config')
    }
    return config.config
}

export const backupConfig = async (config: unknown, path: string) => {
    fs.outputFile(resolve(path, 'config.bak.yaml'), stringifyYAML(config, { indent: 2 }), { encoding: 'utf8' })
}

export const updateConfig = async (config: Omit<YachtConfig, 'secrets'>, path: string) => {
    // configHooks.callHook('update-config', config, path)
    // Validate the config before writing it.
    try {
        // LVConfigSchema.parse(config) as LVConfigType
        YachtConfigSchema.parse(config)
        fs.outputFile(resolve(path, 'config.yaml'), stringifyYAML(config, { indent: 2 }), { encoding: 'utf8' })
    } catch (e) {
        // configHooks.callHook('update-config:error', config, e)
        if (e instanceof ZodError) {
            // configHooks.callHook('update-config:error:zod', config, e)
            throw createError({ ...e })
        } else {
            // configHooks.callHook('update-config:error:other', config, e)
            throw createError('unknown error writing config.')
        }
    }
}

// Check to make sure the config exists. If it doesn't write a new default one.
export const checkConfig = async () => {
    const config = await useRawConfig()
    // configHooks.callHook('check-config', config)
    if (!config.cwd) throw createError(`No directory defined for config`)
    const configExists = await fs.exists(resolve(config.cwd, 'config.yaml'))
    if (!configExists) {
        Logger.warn(`No config exists at ${config.cwd}, creating default config.`, 'config - check')
        updateConfig(defaultYachtConfig, config.cwd)
    } else {
        try {
            // await configHooks.callHook('check-config:validate', config)
            // If the config exists, validate it.
            // LVConfigSchema.parse(config.config) as LVConfigType
            YachtConfigSchema.parse(config.config)
            Logger.sucess(`Valid config exists at ${config.cwd}.`, 'config - check')
        } catch (e) {
            // configHooks.callHook('check-config:error', config, e)
            if (e instanceof ZodError) {
                // configHooks.callHook('check-config:error:zod', config, e)
                backupConfig(config.config, config.cwd)
                Logger.error(`backing up config ${config.cwd}config.bak.yaml`, 'config - check - error')
                // If it's not valid, write a fresh one and throw an error.
                updateConfig(defaultYachtConfig, config.cwd)
                throw createError({ ...e })
            } else {
                // configHooks.callHook('check-config:error:other', config, e)
                throw createError('unknown error validating config.')
            }
        }
    }
}


export const getSecrets = async () => {
    const secrets = await fs.readJSON(configPaths.secrets) as ConfigSecrets
    if (secrets && typeof secrets === 'object') {
        try {
            if (!secrets.accessSecret || !secrets.refreshSecret || !secrets.passphraseSecret || !secrets.authSecret) {
                return await generateSecretTokens()
            } else return secrets
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_e) {
            return await generateSecretTokens();
        }
    } else return await generateSecretTokens();
}

/**
 * Generates the secret token for signing JWTs
 */
const generateSecretTokens = async () => {
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
    fs.outputJSON(configPaths.secrets, secrets)
    return secrets;
}