import { yachtTemplateSchema, type PortainerV1Template, type PortainerV2Template, type YachtTemplate, type YachtV1Template, type YachtV2Template } from "~/types/templates/yacht";
import { useConfig } from "../config";
import { typeTemplate, getTemplateType } from "./formatter";

// setup storage
const configStorage = useStorage('base')
const logger = useLog('templates')

// interface getYachtTemplateDTO extends YachtTemplate {
//     name: string;
//     url: string;
//     description?: string;
//     featured?: number[];
//     templates: PortainerV1Template[] | PortainerV2Template['templates'] | YachtV1Template[] | YachtV2Template[];
// }

export interface addYachtTemplate {
    url: string;
    name: string;
    title?: string;
}

export const getTemplates = async (): Promise<YachtTemplate[]> => {
    const templates = [] as YachtTemplate[]
    const config = await useConfig();
    const templateList = await configStorage.getKeys(config.static.paths.templates)
    const teamplatePromises = templateList.map(async (template) => {
        const _template = await configStorage.getItem(template)
        const isValid = yachtTemplateSchema.safeParse(_template)
        logger.info(`Checking template ${template}: ${isValid}`)
        if (_template) {
            templates.push(_template as YachtTemplate)
        } else {
            logger.error(`Invalid template found at ${template}: ${isValid}`)
        }
    })
    await Promise.all(teamplatePromises)
    return templates
}

export const addTemplate = async ({ url, name: _name, title: _title }: addYachtTemplate) => {
    const config = await useConfig();
    const _template = await $fetch<PortainerV1Template[] | YachtV1Template[] | YachtTemplate | PortainerV2Template>(url, { parseResponse: JSON.parse })
    const exists = await configStorage.getItem(config.static.paths.templates + _name)
    if (!exists) {
        logger.info(`Adding template ${_name}`)
        const title: string = _title !== undefined ? _title : 'title' in _template && _template.title !== undefined ? _template.title : _name ? _name : 'unknown'
        const templateType = await getTemplateType(_template)
        const template = await typeTemplate(_template, { name: _name, title, url, type: templateType })
        await configStorage.setItem(`${config.static.paths.templates}/${_name}.json`, template)
    } else {
        YachtError(new Error('Template already exists.'), '/services/templates/info - addTemplate', true, 'Template')
        // throw createError('Template already exists.')
    }
}