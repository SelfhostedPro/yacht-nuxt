<template>
  <v-slide-y-transition group>
    <v-card v-for="fields, i in arrayFields" :key="i" align="center" class="mx-auto my-1">
      <v-card-text>
        <v-row dense align="center">
          <v-col :cols="xs ? '10' : '11'">
            <v-row dense align="center">
              <v-col :cols="field.cols ? field.cols : field.label === 'Label' || xs ? '12' : '4'"
                v-for="field, i in fields" :key="i" :order="field.type === 'description' ? 5 : undefined">
                <common-form-dynamic-string :field="field" />
              </v-col>
            </v-row>
          </v-col>
          <v-col :cols="xs ? '2' : '1'" class="text-center px-2">
            <v-btn color="foreground" size="small" @click="delRow(i)">-</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-slide-y-transition>
</template>
<script lang="ts" setup>
import { type Field } from '~/types/forms'
import { useDisplay } from "vuetify";
import type { CreateContainerForm } from '~/types/containers/create';
import type { VNodeRef } from 'vue';
const { xs } = useDisplay();
const arrayFields = defineModel<Field[][]>("arrayFields", { required: true });
const emit = defineEmits(['validate'])

interface Props {
  path: keyof CreateContainerForm;
}
const { path } = defineProps<Props>()
const form = useFormValues<CreateContainerForm>()

const delRow = (i: number) => {
  if (form.value[path] && Array.isArray(form.value[path])) {
    (form.value[path] as any[]).splice(i, 1)
    emit('validate');
  }
};

</script>

<style></style>~/shared/forms~/shared/containers/create