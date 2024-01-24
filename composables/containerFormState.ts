import { createContainerFormSchema } from "~/types/containers/create"

export const useContainerFormState = () => {
  const validationSchema = toTypedSchema(createContainerFormSchema)

  const formState = useState('containerFormState', () => {
    const { handleSubmit, handleReset, defineField, values } = useForm({
      validationSchema
    })
    return {
      handleSubmit,
      handleReset,
      defineField,
      values
    }
  })
  return formState
}
