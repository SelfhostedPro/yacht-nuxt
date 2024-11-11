import { type CreateContainerForm, createContainerFormSchema } from '#core/types/containers/create'

export default defineEventHandler(async (event) => {
  const body: CreateContainerForm = await readValidatedBody(event, body => createContainerFormSchema.parse(body))
  return await createContainer(body)
})