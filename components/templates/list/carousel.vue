<template>
  <v-row dense>
    <v-col>
      <v-fade-transition>
        <v-carousel cycle show-arrows="hover" height="400" hide-delimiters progress="primary">
          <v-carousel-item v-for="featuredApp in template.featured" :key="template.templates[featuredApp].title">
            <v-card class="text-center fill-height">
              <v-img height="100%" class="d-flex align-end featured-image"
                :src="template.templates[featuredApp].featured_image || template.templates[featuredApp].logo" cover>
                <v-card :rounded="0" class="featured-card" flat>
                  <v-card-title class="text-high-emphasis">{{ template.templates[featuredApp].title ||
                    template.templates[featuredApp].name
                  }}</v-card-title>
                  <v-card-text style="max-height: 60px;" class="text-high-emphasis overflow-auto mb-2"
                    v-if="template.templates[featuredApp].description">{{
                      template.templates[featuredApp].description }}</v-card-text>
                  <v-card-actions>
                    <v-btn @click="$emit('selectedApp', template.templates[featuredApp]); $emit('openDialog', true)" icon>
                      <v-icon icon="mdi-plus" />
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-img>
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </v-fade-transition>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { YachtTemplate } from '~/types/templates/yacht';

defineEmits(['openDialog', 'selectedApp'])
interface Props {
  template: YachtTemplate
}
defineProps<Props>()

</script>

<style></style>