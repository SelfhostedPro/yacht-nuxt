import { createContainerFormSchema, type CreateContainerForm } from "~/types/containers/create"
import { type FormContext } from 'vee-validate'
import { type PartialDeep } from 'type-fest';

export type FormState = FormContext<PartialDeep<CreateContainerForm>>