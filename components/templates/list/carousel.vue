<template>
  <v-card v-bind="$attrs" class="text-center fill-height">
    <v-slide-group v-model="slideGroup" class="pa-4" center-active show-arrows>
      <v-slide-group-item v-for="featuredApp in template.featured" :key="template.templates[featuredApp].title"
        v-slot="{ isSelected, toggle, selectedClass }">
        <v-card @click="toggle" :color="isSelected ? 'primary' : 'foreground'" class="ma-4 pa-2"
          :width="isSelected ? '50vw' : '20vw'">
          <v-img :height="isSelected ? '300px' : '150px'"
            :src="isSelected ? template.templates[featuredApp].featured_image || template.templates[featuredApp].logo : template.templates[featuredApp].logo" />
          <v-card-title>{{ template.templates[featuredApp].title ||
            template.templates[featuredApp].name }}</v-card-title>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
</template>

<script lang="ts" setup>
import type { YachtTemplate } from '~/types/templates/yacht';
const slideGroup = ref(1)
const currentApp = ref<YachtTemplate['templates'][0]>()
interface Emits {
  (e: 'createApp', app: YachtTemplate['templates'][0]): void
}
defineEmits<Emits>()
interface Props {
  template: YachtTemplate
}
defineProps<Props>()

</script>

<style>
.featured-card {
  background: linear-gradient(0deg, rgba(var(--v-theme-surface), 0.8) 0%, rgba(var(--v-theme-surface), 0.9) 10%, rgba(var(--v-theme-surface), 0.7) 70%, rgba(var(--v-theme-surface), 0.8) 100%);
  backdrop-filter: blur(5px) brightness(40%);
}
</style>

    <!-- <v-carousel cycle show-arrows="hover" height="400" hide-delimiters progress="primary">
      <v-carousel-item v-for="featuredApp in template.featured" :key="template.templates[featuredApp].title"
        :value="currentApp">
        <v-img height="100%" class="d-flex align-end featured-image"
          :src="template.templates[featuredApp].featured_image || template.templates[featuredApp].logo" cover>
          <v-card :rounded="0" class="featured-card" flat>
            <div class="d-flex align-center mt-3 justify-center">
              <v-btn class="mr-auto" @click="$emit('createApp', template.templates[featuredApp]);" icon variant="plain">
                <v-icon icon="mdi-plus" />
              </v-btn>
              <v-card-title style="position: absolute; left: 50%; transform: translateX(-50%);"
                class="text-high-emphasis">{{ template.templates[featuredApp].title ||
                  template.templates[featuredApp].name
                }}</v-card-title>
            </div>
            <v-card-text style="max-height: 60px;" class="text-high-emphasis overflow-auto mb-2"
              v-if="template.templates[featuredApp].description">{{
                template.templates[featuredApp].description }}</v-card-text>
          </v-card>
        </v-img>
      </v-carousel-item>
    </v-carousel> -->