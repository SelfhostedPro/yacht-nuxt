<template>
  <div class="overflow-auto fill-height">
    <v-row no-gutters class="fill-height">
      <v-col :cols="smAndDown ? 12 : 4">
        <v-sheet color="surface" class="fill-height">
          <v-sheet class="d-flex align-start justify-start">
            <containers-create-progress v-model:step="step" />
          </v-sheet>
        </v-sheet>
      </v-col>
      <v-col>
        <v-window v-model="step" direction="vertical" class="fill-height overflow-y-auto px-5">
          <v-window-item v-for="(section, i) in sections" :key="i" :value="i" class="fill-height">
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
import { LazyContainersCreateSectionBasic, LazyContainersCreateSectionInfo, LazyContainersCreateSectionNetworking } from '#components';
const { smAndDown } = useDisplay()

const step = useState('containerFormStep', () => 0)

const sections = [
  LazyContainersCreateSectionBasic,
  LazyContainersCreateSectionInfo,
  LazyContainersCreateSectionNetworking
]
</script>