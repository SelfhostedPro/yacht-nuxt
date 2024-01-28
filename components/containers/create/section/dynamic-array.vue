<template>
  <v-slide-y-transition group>
    <v-card v-for="fields, i in arrayFields" :key="i" align="center" class="mx-auto my-1">
      <v-card-text>
        <v-row dense align="center">
          <v-col :cols="xs ? '10' : '11'">
            <v-row dense align="center">
              <v-col :cols="field.cols ? field.cols : field.label === 'Label' || xs ? '12' : '4'"
                v-for="field, i in fields" :key="i">
                <containers-create-section-dynamic-string :field="field" />
              </v-col>
            </v-row>
          </v-col>
          <v-col :cols="xs ? '2' : '1'" class="text-center px-2">
            <v-btn color="foreground" size="small" @click="delPort(i)">-</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-slide-y-transition>
</template>
<script lang="ts" setup>
import type { Field } from "./dynamic-string.vue";
import { useDisplay } from "vuetify";
const { xs } = useDisplay();
const arrayFields = defineModel<Field[][]>("arrayFields", { required: true });

const delPort = (i: number) => {
  arrayFields.value.splice(i, 1);
};

</script>

<style></style>