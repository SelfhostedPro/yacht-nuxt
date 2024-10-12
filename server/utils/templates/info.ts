import { yachtTemplateSchema, type PortainerV1Template, type PortainerV2Template, type YachtTemplate, type YachtV1Template, type YachtV2Template } from "~~/types/templates/yacht";
import { typeTemplate, getTemplateType } from "./formatter";
import fs from 'fs-extra'
import { configPaths } from "~~/modules/config/runtime/server/utils/config";
import {
    parseJSON5,
    parseJSONC,
    parseYAML,
    parseTOML,
} from "confbox";

const configStorage = useStorage('base')
export interface addYachtTemplate {
    url: string;
    name: string;
    title?: string;
}

export const getTemplates = async (): Promise<YachtTemplate[]> => {
    const templates = [] as YachtTemplate[]
    if (!(await fs.exists(configPaths.templates))) {
        fs.mkdir(configPaths.templates)
    }
    const templateList = await fs.readdir(configPaths.templates)
    const teamplatePromises = templateList.map(async (template) => {
        const _template = await fs.readJSON(`${configPaths.templates}/${template}`)
        const isValid = yachtTemplateSchema.deepPartial().safeParse(_template).success
        if (_template && isValid) {
            templates.push(_template as YachtTemplate)
        } else {
            Logger.error(`Invalid template found at ${template}: ${isValid}`)
        }
    })
    await Promise.all(teamplatePromises)
    return templates
}

type TemplateVersions = PortainerV1Template[] | YachtV1Template[] | YachtTemplate | PortainerV2Template

const parseTemplate = {
    'yaml': (txt: string) => parseYAML<TemplateVersions>(txt, {}),
    'yml': (txt: string) => parseYAML<TemplateVersions>(txt, {}),
    'json': (txt: string) => parseJSONC<TemplateVersions>(txt, {}),
    'toml': (txt: string) => parseTOML<TemplateVersions>(txt)
}

export const addTemplate = async ({ url, name: _name, title: _title }: addYachtTemplate) => {
    const extension = url.substring(url.lastIndexOf('.') + 1)
    if (extension! in ["yaml", "yml", "json", "toml"]) {
        throw createError(new Error(`${extension} not in supported template file types. Make sure you're using the url to the raw file and it's in json/yaml/toml format`))
    }
    const _template = await $fetch<TemplateVersions>(url, { parseResponse: (txt) => parseTemplate[extension as keyof typeof parseTemplate](txt) })
    const exists = await fs.exists(`${configPaths.templates}/${_name}.json`)
    if (!exists) {
        Logger.info(`Adding template ${_name}`)
        const title: string = _title !== undefined ? _title : 'title' in _template && _template.title !== undefined ? _template.title : _name ? _name : 'unknown'
        const templateType = getTemplateType(_template)
        const template = await typeTemplate(_template, { name: _name, title, url, type: templateType })
        await fs.outputJSON(`${configPaths.templates}/${_name}.json`, template)
        return template
    } else {
        createError(new Error('Template already exists.'))
    }
}