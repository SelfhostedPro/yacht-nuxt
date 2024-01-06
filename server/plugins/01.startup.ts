import { YachtConfigSchema, type YachtConfig } from '~/types/config';
import yaml from 'js-yaml'
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { useLogger } from '@nuxt/kit'
import ConfigController from '../utils/config'

export const Config = new ConfigController()

export default defineNitroPlugin(async (nitroApp) => {
    const logger = useLogger('startup:config')
    logger.info('Starting up config plugin...')
    Config.getConfig()
    logger.success('config plugin started.')
})