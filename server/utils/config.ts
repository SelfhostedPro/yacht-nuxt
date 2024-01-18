import { YachtConfigSchema, type YachtConfig } from '~/types/config';
import yaml from 'js-yaml'
import consola from 'consola'
const defaultConfig: YachtConfig = {
  base: {
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
  },
};

let _config: YachtConfig

// setup logger
const logger = consola

// setup storage
const configDir = useStorage('config')

export const useConfig = async () => {
  if (!_config) {
    _config = await getConfig()
  } else {
    return _config
  }
}

export const getConfig = async (): Promise<YachtConfig> => {
  const configFile = await configDir.getItem('config.yml')
  if (configFile) {
    const config = yaml.load(configFile?.toString() || "") as YachtConfig
    const isValid = await validateConfig(config)
    if (isValid) {
      return config
    } else {
      logger.warn(`Config at ${useStorage().getMount('config').base}/config.yml is invalid! Backing up and replacing with default...`)
      await backupConfig(config)
      return await createConfig()
    }
  } else {
    logger.warn(`Config at ${useStorage().getMount('config').base}/config.yml not found! Creating new config...`)
    return await createConfig()
  }
}

const backupConfig = async (oldConfig: YachtConfig) => {
  await configDir.setItem('config.yml.bak', yaml.dump(oldConfig), {})
}

const validateConfig = async (config: YachtConfig) => {
  return (await YachtConfigSchema.safeParseAsync(config)).success
}

const createConfig = async () => {
  await configDir.setItem('config.yml', yaml.dump(defaultConfig), {})
  _config = defaultConfig
  logger.success(`New config created at: ${useStorage().getMount('config').base}/config.yml`)
  return defaultConfig
}