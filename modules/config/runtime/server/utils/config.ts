import { loadDotenv, watchConfig, type ConfigLayerMeta, type ConfigWatcher, type ResolvedConfig, type WatchConfigOptions } from "c12"
import { baseYachtConfig, defaultYachtConfig } from "./defaults"
import fs from 'fs-extra'
import { stringifyYAML } from 'confbox'
import { resolve } from 'path'
import { YachtConfigSchema, type YachtConfig } from "../../../types"
import { ZodError } from "zod"
import type { ConfigSecrets } from "../../../types/secrets"
import { join } from 'path'
import * as crypto from 'crypto';
import defu from "defu"
import { promises as fsPromises } from 'fs'

const nuxtConfig = useRuntimeConfig()

const configStorage = useStorage('config')
const dataStorage = useStorage('data')

fs.ensureDirSync(`${nuxtConfig.yacht.configOptions.configPath}`)
if (!fs.existsSync(`${nuxtConfig.yacht.configOptions.configPath}/config.yaml`)) {
    fs.writeFileSync(`${nuxtConfig.yacht.configOptions.configPath}/config.yaml`, stringifyYAML(defaultYachtConfig, { indent: 2 }))
}
const DefaultWatchOptions: WatchConfigOptions<YachtConfig> = {
    cwd: nuxtConfig.yacht.configOptions.configPath,
    debounce: 100,
    // configFile: 'config.yaml',
    name: 'config',
    rcFile: false,
    dotenv: false,
    defaultConfig: {
        ...defaultYachtConfig,
        servers: [],
    }
}

const _config = watchConfig({
    ...DefaultWatchOptions,
    async onWatch({ type, path }) {
        Logger.info(`config file ${path} - ${type}`, 'config - watcher')
        await checkConfig()
    },
    async onUpdate({ getDiff }) {
        const diff = getDiff()
        diff.map((change, i) => {
            Logger.info(`config file change ${i + 1} of ${diff.length}: ${change}`, 'config - watcher')
        })
        // await checkConfig()
    },
})

export const configPaths = {
    secrets: join(nuxtConfig.yacht.configOptions.configPath, '.secrets.json'),
    ssh: join(nuxtConfig.yacht.configOptions.configPath, '.ssh'),
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
        throw createError('No config found, creating a fresh config')
    }
    return config
}

export const useConfig = async (): Promise<YachtConfig> => {
    const { config } = await useRawConfig()
    if (!config) {
        throw createError('No config found, creating a fresh config')
    }
    return config
}

export const backupConfig = async (config: any, path: string) => {
    await fsPromises.writeFile(
        resolve(path, 'config.bak.yaml'),
        stringifyYAML(config, { indent: 2 }),
        'utf8'
    )
}

export const updateConfig = async (config: Omit<YachtConfig, 'secrets'>, path: string) => {
    try {
        YachtConfigSchema.parse(config)
        await fsPromises.writeFile(
            resolve(path, 'config.yaml'),
            stringifyYAML(config, { indent: 2 }),
            'utf8'
        )
        return config
    } catch (e) {
        if (e instanceof ZodError) {
            throw createError({ ...e })
        }
        throw createError('Unknown error writing config.')
    }
}

// Check to make sure the config exists. If it doesn't write a new default one.
export const checkConfig = async () => {
    const config = await useRawConfig()
    if (!config.cwd) throw createError('No directory defined for config')

    const configPath = resolve(config.cwd, 'config.yaml')
    try {
        await fsPromises.access(configPath)
    } catch {
        Logger.warn(`No config exists at ${config.cwd}, creating default config.`, 'config - check')
        return await updateConfig(defaultYachtConfig, config.cwd)
    }

    try {
        YachtConfigSchema.parse(config.config)
        Logger.success(`Valid config exists at ${config.cwd}.`, 'config - check')
    } catch (e) {
        if (e instanceof ZodError) {
            await backupConfig(config.config, config.cwd)
            Logger.error(`Backing up config ${config.cwd}config.bak.yaml`, 'config - check - error')
            await updateConfig(defaultYachtConfig, config.cwd)
            throw createError({ ...e })
        }
        throw createError('Unknown error validating config.')
    }
}

export const getSecrets = async (): Promise<ConfigSecrets> => {
    try {
        const secrets = await fsPromises.readFile(configPaths.secrets, 'utf8')
        const parsedSecrets = JSON.parse(secrets) as ConfigSecrets
        if (isValidSecrets(parsedSecrets)) {
            return parsedSecrets
        }
    } catch { }
    return generateSecretTokens()
}

const isValidSecrets = (secrets: any): secrets is ConfigSecrets => {
    return (
        secrets &&
        typeof secrets === 'object' &&
        typeof secrets.accessSecret === 'string' &&
        typeof secrets.refreshSecret === 'string' &&
        typeof secrets.authSecret === 'string' &&
        typeof secrets.passphraseSecret === 'object' &&
        typeof secrets.passphraseSecret.key === 'string' &&
        typeof secrets.passphraseSecret.iv === 'string'
    )
}

const generateSecretTokens = async (): Promise<ConfigSecrets> => {
    const secrets: ConfigSecrets = {
        authSecret: crypto.randomBytes(256).toString('base64'),
        accessSecret: crypto.randomBytes(256).toString('base64'),
        refreshSecret: crypto.randomBytes(256).toString('base64'),
        passphraseSecret: {
            key: crypto.randomBytes(32).toString('base64'),
            iv: crypto.randomBytes(16).toString('base64'),
        },
    }

    await fsPromises.writeFile(configPaths.secrets, JSON.stringify(secrets, null, 2))
    return secrets
}
