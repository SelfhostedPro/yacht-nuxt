import { addTemplate } from '~/server/services/templates/info'
import { addTemplateSchema } from '~/types/templates/yacht'
export default defineEventHandler(async (event) => {
  const { url, name, title } = await readValidatedBody(event, addTemplateSchema.parse)
  return await addTemplate({ url, name, title })
})