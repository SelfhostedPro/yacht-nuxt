<template>
  <v-card v-bind="$attrs" class="text-center fill-height">
    <v-carousel cycle show-arrows="hover" height="400" hide-delimiters progress="primary">
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
    </v-carousel>
  </v-card>
</template>

<script lang="ts" setup>
import type { YachtTemplate } from '~/types/templates/yacht';
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
  background: linear-gradient(0deg, rgba(33, 33, 33, 0.8) 0%, rgba(33, 33, 33, 0.9) 10%, rgba(33, 33, 33, 0.9) 90%, rgba(33, 33, 33, 0.8) 100%);
  backdrop-filter: blur(5px) brightness(40%);
}
</style>