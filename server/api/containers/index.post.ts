import { createContainer } from '~/server/services/containers/actions'
import { type CreateContainerForm, createContainerFormSchema } from '~/types/containers/create'

export default defineEventHandler(async (event) => {
  const body: CreateContainerForm = await readValidatedBody(event, body => createContainerFormSchema.parse(body))
  return await createContainer(body)
})