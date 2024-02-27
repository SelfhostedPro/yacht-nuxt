<template>
  <div class="fill-height">
    <v-row no-gutters class="fill-height">
      <!-- Form Progress -->
      <v-col :cols="smAndDown ? 12 : 4" :class="`${!smAndDown ? 'fill-height' : null} overflow-y-auto`">
        <v-sheet color="surface" class="fill-height">
          <v-sheet class="d-flex align-start justify-start">
            <containers-create-progress v-model:step="step" />
          </v-sheet>
        </v-sheet>
      </v-col>
      <!-- Form Fields -->
      <v-col class="fill-height">
        <v-window v-model="step" direction="vertical" class="fill-height">
          <v-window-item v-for="(section, i) in sections" :key="i" :value="i" class="fill-height overflow-y-auto">
            <v-card color="foreground" flat rounded="0" class="mx-auto my-auto">
              <component :is="section" />
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';
import {
  ContainersCreateSectionBase,
  ContainersCreateSectionInfo,
  ContainersCreateSectionNetworking,
  ContainersCreateSectionStorage,
  ContainersCreateSectionEnvironment,
  ContainersCreateSectionAdvanced,
  ContainersCreateSectionPreview
} from '#components';
import type { CreateContainerForm } from '~/types/containers/create';

const { smAndDown } = useDisplay()
const step = useState('containerFormStep', () => 0)

const sections = [
  ContainersCreateSectionBase,
  ContainersCreateSectionInfo,
  ContainersCreateSectionNetworking,
  ContainersCreateSectionStorage,
  ContainersCreateSectionEnvironment,
  ContainersCreateSectionAdvanced,
  ContainersCreateSectionPreview
]
</script>~/shared/containers/create