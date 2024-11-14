<template>
  <div class="bg-surface">
    <Carousel>
      <CarouselContent class="flex pt-2 pb-2">
        <CarouselItem
          v-for="featuredApp in template.featured"
          :key="featuredApp"
          class="flex-none w-1/2 px-5"
        >
          <img
            v-if="template.templates[featuredApp]"
            :src="
              template.templates[featuredApp]?.featured_image ||
              template.templates[featuredApp]?.logo
            "
            class="flex items-end justify-center overflow-visible featured-image h-[50vh] bg-surface"
          >
            <div class="featured-card mx-[-4px]">
              <div class="flex items-center mt-3 justify-center">
                <Button
                  class="mr-auto"
                  variant="ghost"
                  @click="handleCreateApp(featuredApp)"
                >
                  <Plus class="w-4 h-4" />
                </Button>
                <CardTitle class="absolute left-1/2 transform -translate-x-1/2 text-high-emphasis">
                  {{
                    template.templates[featuredApp]?.title ||
                    template.templates[featuredApp]?.name
                  }}
                </CardTitle>
              </div>
              <CardContent
                v-if="template.templates[featuredApp]?.description"
                class="h-[60px] text-high-emphasis overflow-auto pb-2"
              >
                {{ template.templates[featuredApp]?.description }}
              </CardContent>
            </div>
          </img>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { YachtTemplate } from '#core/types/templates/yacht';

interface Emits {
  (e: "createApp", app: YachtTemplate["templates"][0]): void;
}

const emit = defineEmits<Emits>();
const { template } = defineProps<{ template: YachtTemplate }>();

const handleCreateApp = (featuredApp: number) => {
  const app = template.templates[featuredApp];
  if (app) {
    emit('createApp', app);
  }
};
</script>

<style scoped>
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
