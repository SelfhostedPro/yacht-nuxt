<template>
  <div class="embla bg-surface">
    <div ref="emblaRef" class="embla__viewport">
      <div class="embla__container">
        <div
          v-for="featuredApp in template.featured"
          :key="featuredApp"
          class="embla__slide embla__class-names rounded pa-0 my-0 mx-5"
        >
          <v-img
            v-if="template.templates[featuredApp]"
            cover
            class="d-flex align-end featured-image overflow-visible justify-center"
            color="surface"
            height="50vh"
            :src="
              template.templates[featuredApp]?.featured_image ||
              template.templates[featuredApp]?.logo
            "
          >
            <div class="featured-card mx-n1">
              <div class="d-flex align-center mt-3 justify-center">
                <v-btn
                  class="mr-auto"
                  icon
                  variant="plain"
                  @click="handleCreateApp(featuredApp)"
                >
                  <v-icon icon="mdi-plus" />
                </v-btn>
                <v-card-title
                  style="
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                  "
                  class="text-high-emphasis"
                  >{{
                    template.templates[featuredApp]?.title ||
                    template.templates[featuredApp]?.name
                  }}</v-card-title
                >
              </div>
              <v-card-text
                v-if="template.templates[featuredApp]?.description"
                style="height: 60px"
                class="text-high-emphasis overflow-auto pb-2"
                >{{ template.templates[featuredApp]?.description }}</v-card-text
              >
            </div>
          </v-img>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { YachtTemplate } from "~~/types/templates/yacht";

interface Emits {
  (e: "createApp", app: YachtTemplate["templates"][0]): void;
}
const emit = defineEmits<Emits>();
interface Props {
  template: YachtTemplate;
}
const { template } = defineProps<Props>();

const handleCreateApp = (featuredApp: number) => {
  const app = template.templates[featuredApp];
  if (app) {
    emit('createApp', app);
  }
};
</script>

<style scoped>
.embla {
  overflow: hidden;
}
.embla__container {
  display: flex;
  justify-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
}
.embla__slide {
  flex: 0 0 50%;
  min-width: 0;
  padding: 0;
}
.featured-card {
  width: 101%;
  background: linear-gradient(
    0deg,
    rgba(var(--v-theme-surface), 0.8) 0%,
    rgba(var(--v-theme-surface), 0.9) 10%,
    rgba(var(--v-theme-surface), 0.7) 70%,
    rgba(var(--v-theme-surface), 0.8) 100%
  );
  backdrop-filter: blur(5px) brightness(40%);
}
</style>
