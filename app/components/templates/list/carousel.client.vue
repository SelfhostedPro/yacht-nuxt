<template>
  <v-card
    v-bind="$attrs"
    height="50vh"
    class="text-center d-flex align-center"
    rounded="0"
    variant="flat"
  >
    <v-slide-group
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      mandatory
      :show-arrows="false"
      v-model="carousel"
      center-active
    >
      <v-slide-group-item
        v-for="featuredApp in template.featured"
        :key="template.templates[featuredApp].title"
        v-slot="{ isSelected, toggle, selectedClass }"
      >
        <v-img
          cover
          class="d-flex align-end featured-image mx-3 my-3 rounded"
          @click="toggle"
          :color="isSelected ? 'primary' : 'foreground'"
          max-width="50vw"
          min-width="30vw"
          height="50vh"
          :aspect-ratio="isSelected ? 16 / 9 : 4 / 3"
          :src="
            template.templates[featuredApp].featured_image ||
            template.templates[featuredApp].logo
          "
        >
          <v-card rounded="0" class="featured-card">
            <div class="d-flex align-center mt-3 justify-center">
              <v-btn
                class="mr-auto"
                @click="$emit('createApp', template.templates[featuredApp])"
                icon
                variant="plain"
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
                  template.templates[featuredApp].title ||
                  template.templates[featuredApp].name
                }}</v-card-title
              >
            </div>
            <v-card-text
              v-if="isSelected && template.templates[featuredApp].description"
              style="height: 60px"
              class="text-high-emphasis overflow-auto mb-2"
              >{{ template.templates[featuredApp].description }}</v-card-text
            >
          </v-card>
        </v-img>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
</template>

<script lang="ts" setup>
import type { YachtTemplate } from "~/types/templates/yacht";
const carousel = ref(0);
const currentApp = ref<YachtTemplate["templates"][0]>();
interface Emits {
  (e: "createApp", app: YachtTemplate["templates"][0]): void;
}
defineEmits<Emits>();
interface Props {
  template: YachtTemplate;
}
const { template } = defineProps<Props>();

const hovered = ref(false);
const autoplayTimeout = ref(-1);
const startTimeout = () => {
  autoplayTimeout.value = window.setTimeout(() => {
    template.featured?.length && template.featured.length - 1 > carousel.value
      ? carousel.value++
      : (carousel.value = 0);
    resetTimeout();
  }, 10000);
};
const resetTimeout = () => {
  window.clearTimeout(autoplayTimeout.value);
  window.requestAnimationFrame(startTimeout);
};

watch(hovered, (val) => {
  val === true ? window.clearTimeout(autoplayTimeout.value) : resetTimeout();
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

.v-slide-group__next,
.v-slide-group__prev {
  display: none !important;
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
~/shared/templates/yacht
