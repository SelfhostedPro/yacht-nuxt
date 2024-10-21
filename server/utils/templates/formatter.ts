import { yachtV1TemplateSchema, yachtV2TemplateSchema, portainerV1TemplateSchema, portainerV2TemplateSchema, type PortainerV1Template, type YachtV1Template, type YachtV2Template, type PortainerV2Template, type YachtTemplate } from "~~/types/templates/yacht";

interface TemplateInfo {
    name: string;
    title: string;
    url: string;
    type: 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2';
}

export const getTemplateType = (template: PortainerV1Template[] | YachtV1Template[] | YachtTemplate | PortainerV2Template): 'yachtv1' | 'yachtv2' | 'portainerv1' | 'portainerv2' => {
    const schemas = [
        { schema: yachtV2TemplateSchema, type: 'yachtv2' },
        { schema: yachtV1TemplateSchema, type: 'yachtv1' },
        { schema: portainerV1TemplateSchema, type: 'portainerv1' },
        { schema: portainerV2TemplateSchema, type: 'portainerv2' },
    ] as const;

    for (const { schema, type } of schemas) {
        if (schema.safeParse(template).success) {
            return type;
        }
    }

    throw createError('Unknown template type.');
}

export const typeTemplate = async (template: PortainerV1Template[] | YachtV1Template[] | YachtTemplate | PortainerV2Template, info: TemplateInfo): Promise<YachtTemplate> => {
    const formattedTemplate = await formatTemplate(info, template);
    if (formattedTemplate === null) {
        throw createError('Unknown template type.');
    }
    return formattedTemplate;
}

const formatTemplate = async (info: TemplateInfo, template: any): Promise<YachtTemplate | null> => {
    const now = new Date().toISOString();
    const baseTemplate = { ...info, created: now, updated: now };

    switch (info.type) {
        case 'yachtv1':
            return {
                ...baseTemplate,
                templates: template
            };
        case 'yachtv2':
            return {
                ...template,
                ...baseTemplate
            };
        case 'portainerv1':
            return {
                ...baseTemplate,
                templates: template as PortainerV1Template[]
            };
        case 'portainerv2':
            return {
                ...baseTemplate,
                templates: template.templates
            };
        default:
            return null;
    }
}
