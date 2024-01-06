import { YachtConfigSchema, type YachtConfig } from '~/types/config';
import yaml from 'js-yaml'
import { useLogger } from '@nuxt/kit'
import type { Driver } from 'unstorage';

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

class ConfigController {
  logger
  driver: Driver
  base: string
  default = defaultConfig

  constructor() {
    this.logger = useLogger('config')
    this.base = useStorage().getMount('config').driver.options['base']
    this.driver = useStorage().getMount('config').driver
  }
  createConfig = () => {
    this.driver.setItem && this.driver.setItem('config.yml', yaml.dump(defaultConfig), {})
    this.logger.success(`New config created at: ${this.base}/config.yml`)
    return this.driver.getItem('config.yml') as YachtConfig
  }
  backupConfig = async (oldConfig: YachtConfig) => {
    this.driver.setItem && await this.driver.setItem('config.yml.bak', yaml.dump(oldConfig), {})
  }
  validateConfig = async (config: YachtConfig) => {
    return (await YachtConfigSchema.safeParseAsync(config)).success
  }
  getConfig = async (): Promise<YachtConfig> => {
    const configFile = await this.driver.getItem('config.yml')
    const config = yaml.load(configFile?.toString() || "") as YachtConfig
    const isValid = await this.validateConfig(config)
    if (isValid && config) {
      return config
    } else if (config) {
      this.logger.warn(`Config at ${this.base}/config.yml is invalid! Backing up and replacing with default...`)
      await this.backupConfig(config)
      return this.createConfig()
    } else {
      this.logger.warn(`Config not detected at ${this.base}/config.yml! Generating default config`)
      return this.createConfig()
    }
  }
}

export default ConfigController
