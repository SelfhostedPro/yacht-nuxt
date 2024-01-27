<template>
  <div>
    <v-btn icon color="primary" @click="dialog = true">
      <v-icon icon="mdi-plus" />
    </v-btn>

    <v-dialog v-model="dialog" persistent scrollable :fullscreen="maximize" :width="maximize ? undefined : '80vw'"
      :height="maximize ? undefined : '80vh'">
      <template #default>
        <v-card color="foreground" width="80vw" height="100%">
          <common-title-bar class="form-bar" :loading="loading" color="primary" :closable="true"
            :title="`create ${values.name || 'new container'}`" @maximize="maximize = !maximize"
            @close="dialog = false" />
          <form class="overflow-y-hidden fill-height">
            <containers-create-form />
          </form>
          <v-card-actions style="background-color: rgb(var(--v-theme-surface)) !important;">
            <v-spacer />
            <v-btn v-if="step !== 0" @click="step--">
              prev
            </v-btn>
            <v-btn v-if="step !== 6" color="primary" @click="step++">
              next
            </v-btn>
            <v-btn v-else color="primary">
              submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { type YachtTemplate } from '~/types/templates/yacht';
import { createContainerFormSchema } from "~/types/containers/create"
interface Props {
  template?: YachtTemplate,
}
defineProps<Props>()
const loading = ref(false)
const step = useState('containerFormStep', () => 0)
const { values, validate, handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(createContainerFormSchema)
},)

const test = useFormValues()



const maximize = ref(false)
const dialog = ref(false)


defineEmits(['close', 'maximize'])
</script>

<style></style>