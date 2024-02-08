import { yachtV1TemplateSchema, yachtV2TemplateSchema, portainerV1TemplateSchema, portainerV2TemplateSchema, type PortainerV1Template, type YachtV1Template, type YachtV2Template, type PortainerV2Template, type YachtTemplate, yachtTemplateSchema } from "~/types/templates/yacht";

interface TemplateInfo {
    name: string;
    title: string;
    url: string;
    type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2';
}

export const getTemplateType = (template: PortainerV1Template[] | YachtV1Template[] | YachtTemplate | PortainerV2Template): 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2' => {
    if (yachtV2TemplateSchema.safeParse(template).success) {
        return 'yachtv2';
    } else if (yachtV1TemplateSchema.safeParse(template).success) {
        return 'yachtv1';
    } else if (portainerV1TemplateSchema.safeParse(template).success) {
        return 'portainerv1';
    } else if (portainerV2TemplateSchema.safeParse(template).success) {
        return 'portainerv2';
    } else {
        throw createError('Unknown template type.');
    }
}


export const typeTemplate = async (template: PortainerV1Template[] | YachtV1Template[] | YachtTemplate | PortainerV2Template, { name, title, type, url }: TemplateInfo): Promise<YachtTemplate> => {
    const formattedTemplate: YachtTemplate | null = await formatTemplate({ name, title, url, type }, template);
    if (!formattedTemplate === null) {
        throw createError('Unknown template type.');
    }
    return formattedTemplate as YachtTemplate;
}

const formatTemplate = async (info: { name: string, title: string, url: string, type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2' }, template: any): Promise<YachtTemplate | null> => {
    const now = new Date().toISOString();
    switch (info.type) {
        case 'yachtv1':
            return {
                ...info,
                created: now,
                image: undefined,
                authors: undefined,
                featured: undefined,
                description: undefined,
                links: undefined,
                templates: template
            };
        case 'yachtv2':
            return {
                ...template,
                name: info.name,
                title: info.title,
                created: now,
                updated: now,
                url: info.url,
                type: info.type
            };
        case 'portainerv1':
            return {
                ...info,
                created: now,
                updated: now,
                templates: template as PortainerV1Template[]
            };
        case 'portainerv2':
            return {
                ...info,
                created: now,
                updated: now,
                templates: template.templates
            };
        default:
            return null;
    }
}