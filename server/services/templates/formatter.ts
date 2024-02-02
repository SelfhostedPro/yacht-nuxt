import { yachtV1TemplateSchema, yachtV2TemplateSchema, portainerV1TemplateSchema, portainerV2TemplateSchema, type PortainerV1Template, type YachtV1Template, type YachtV2Template, type PortainerV2Template, type YachtTemplate, yachtTemplateSchema } from "~/types/templates/yacht";

interface TemplateInfo {
    name: string;
    title: string;
    url: string;
    type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2';
}

export const getTemplateType = async (template: PortainerV1Template[] | YachtV1Template[] | YachtTemplate | PortainerV2Template): Promise<'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2'> => {
    var type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2' | 'unknown' = 'unknown';
    yachtTemplateSchema.safeParse(template) ? type = 'yachtv2' :
        yachtV1TemplateSchema.safeParse(template).success ? type = 'yachtv1' :
            portainerV1TemplateSchema.safeParse(template).success ? type = 'portainerv1' :
                portainerV2TemplateSchema.safeParse(template).success ? type = 'portainerv2' : type = 'unknown'
    if (type === 'unknown') throw createError('Unknown template type.')
    return type
}

export const typeTemplate = async (template: PortainerV1Template[] | YachtV1Template[] | YachtTemplate | PortainerV2Template, { name, title, type, url }: TemplateInfo): Promise<YachtTemplate> => {
    switch (type) {
        case 'yachtv1':
            return await formatYachtV1Template(template as YachtV1Template[], { name, title, url, type: 'yachtv1' })
        case 'yachtv2':
            return await formatYachtV2Template(template as YachtTemplate, { name, title, url, type: 'yachtv2' })
        case 'portainerv1':
            return await formatPortainerV1Template(template as PortainerV1Template[], { name, title, url, type: 'portainerv1' })
        case 'portainerv2':
            return await formatPortainerV2Template(template as PortainerV2Template, { name, title, url, type: 'portainerv2' })
        default:
            throw createError('Unknown template type.')
    }
}

const formatYachtV1Template = async (template: YachtV1Template[], { name, title, url, type }: { name: string, title: string, url: string, type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2' }): Promise<YachtTemplate> => {
    console.log('formatting v1 template')

    return {
        name: name,
        title: title,
        url: url,
        created: new Date().toISOString(),
        type: type,
        image: undefined,
        authors: undefined,
        featured: undefined,
        description: undefined,
        links: undefined,
        templates: template
    }
}

const formatYachtV2Template = async (template: YachtTemplate, { name, title, url, type }: { name: string, title: string, url: string, type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2' }): Promise<YachtTemplate> => {
    template.name = name,
        template.title = title,
        template.created = new Date().toISOString()
    template.updated = new Date().toISOString()
    template.url = url
    template.type = type
    console.log('formatting v2 template')
    return template
}

const formatPortainerV1Template = async (template: PortainerV1Template[], { name, title, url, type }: { name: string, title: string, url: string, type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2' }): Promise<YachtTemplate> => {
    console.log('formatting portainer v1 template')
    return {
        name: name,
        title: title,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        url: url,
        type: type,
        templates: template as PortainerV1Template[],
    }
}

const formatPortainerV2Template = async (template: PortainerV2Template, { name, title, url, type }: { name: string, title: string, url: string, type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2' }): Promise<YachtTemplate> => {
    console.log('formatting portainer v2 template')
    return {
        name: name,
        title: title,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        url: url,
        type: type,
        templates: template.templates,
    }
}