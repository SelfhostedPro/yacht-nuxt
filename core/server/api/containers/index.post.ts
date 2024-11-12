import { type CreateContainerForm, createContainerFormSchema } from '#docker/types/containers/create'
import { createContainer } from '#docker/server/utils/containers/actions'

export default defineEventHandler(async (event) => {
  const body: CreateContainerForm = await readValidatedBody(event, body => createContainerFormSchema.parse(body))
  return await createContainer(body)
})