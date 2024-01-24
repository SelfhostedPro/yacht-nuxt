<template>
  <div>
    <v-row>
      <v-col :cols="smAndDown ? 12 : 4">
        <v-sheet
          color="surface"
          class="fill-height"
        >
          <v-sheet
            color="surface"
            class="d-flex align-start justify-start"
          >
            <containers-create-progress v-model:step="step" />
          </v-sheet>
        </v-sheet>     
      </v-col>
      <v-col>
        <v-window
          v-model="step"
          direction="vertical"
        >
          <v-window-item
            v-for="(section, i) in sections"
            :key="i"
            :value="i"
          >
            {{ form.values }}
            <component :is="section" />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    <v-card-actions style="background-color: rgb(var(--v-theme-surface)) !important;">
      <v-spacer />
      <v-btn
        v-if="step !== 0"
        @click="step--"
      >
        prev
      </v-btn>
      <v-btn
        v-if="step !== 6"
        color="primary"
        @click="step++"
      >
        next
      </v-btn>
      <v-btn
        v-else
        color="primary"
      >
        submit
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';
import { LazyContainersCreateSectionBasic, LazyContainersCreateSectionInfo } from '#components';
const { smAndDown } = useDisplay()

const step = useState('containerFormStep', () => 0)
const form = useContainerFormState()


const sections = [
LazyContainersCreateSectionBasic,
LazyContainersCreateSectionInfo
]
</script>