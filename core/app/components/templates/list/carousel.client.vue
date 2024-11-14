<template>
  <Card class="h-[50vh] text-center flex items-center rounded-none">
    <Carousel
      v-model:current-slide="carousel"
      :show-arrows="false"
      center-active
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <CarouselItem
        v-for="(featuredApp, index) in template.featured || []"
        :key="template.templates[featuredApp]?.title || featuredApp"
        @click="toggle(index)"
      >
        <img
          v-if="template.templates[featuredApp]"
          :src="
            template.templates[featuredApp]?.featured_image ||
            template.templates[featuredApp]?.logo
          "
          class="flex items-end featured-image mx-3 my-3 rounded"
          :class="carousel === index ? 'bg-primary' : 'bg-foreground'"
          :style="{ maxWidth: '50vw', minWidth: '30vw', height: '50vh', aspectRatio: carousel === index ? '16/9' : '4/3' }"
        >
          <Card class="featured-card rounded-none">
            <div class="flex items-center mt-3 justify-center">
              <Button
                class="mr-auto"
                variant="ghost"
                @click.stop="handleCreateApp(featuredApp)"
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
              v-if="carousel === index && template.templates[featuredApp]?.description"
              class="h-[60px] text-high-emphasis overflow-auto mb-2"
            >
              {{ template.templates[featuredApp]?.description }}
            </CardContent>
          </Card>
        </img>
      </CarouselItem>
    </Carousel>
  </Card>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import type { YachtTemplate } from '#core/types/templates/yacht';

interface Emits {
  (e: "createApp", app: YachtTemplate["templates"][0]): void;
}

interface Props {
  template: YachtTemplate;
}

const emit = defineEmits<Emits>();
const { template } = defineProps<Props>();

const carousel = ref(0);
const hovered = ref(false);
const autoplayTimeout = ref(-1);

const handleCreateApp = (featuredApp: number) => {
  const app = template.templates[featuredApp];
  if (app) {
    emit('createApp', app);
  }
};

const toggle = (index: number) => {
  carousel.value = index;
};

const startTimeout = () => {
  autoplayTimeout.value = window.setTimeout(() => {
    if (template.featured?.length) {
      if (template.featured.length - 1 > carousel.value) {
        carousel.value++;
      } else {
        carousel.value = 0;
      }
    }
    resetTimeout();
  }, 10000);
};

const resetTimeout = () => {
  window.clearTimeout(autoplayTimeout.value);
  window.requestAnimationFrame(startTimeout);
};

watch(hovered, (val) => {
  if (val === true) {
    window.clearTimeout(autoplayTimeout.value);
  } else {
    resetTimeout();
  }
});

onMounted(() => {
  startTimeout();
});
</script>

<style>
.featured-card {
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
