<template>
  <div class="embla bg-surface">
    <div class="embla__viewport" ref="emblaRef">
      <div class="embla__container">
        <div
          v-for="featuredApp in template.featured"
          :key="template.templates[featuredApp].title"
          class="embla__slide embla__class-names rounded pa-0 my-0 mx-5"
        >
          <!-- @click="toggle"
          :color="isSelected ? 'primary' : 'foreground'"
          :aspect-ratio="isSelected ? 16 / 9 : 4 / 3" -->

          <v-img
            cover
            class="d-flex align-end featured-image overflow-visible justify-center"
            color="surface"
            height="50vh"
            :src="
              template.templates[featuredApp].featured_image ||
              template.templates[featuredApp].logo
            "
          >
            <div class="featured-card mx-n1">
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
              <!-- isSelected &&  -->
              <v-card-text
                v-if="template.templates[featuredApp].description"
                style="height: 60px"
                class="text-high-emphasis overflow-auto pb-2"
                >{{ template.templates[featuredApp].description }}</v-card-text
              >
            </div>
          </v-img>
        </div>
      </div>
    </div>
    <!-- <v-btn @click="emblaApi?.scrollPrev()" class="embla__prev">Prev</v-btn>
    <v-btn @click="emblaApi?.scrollNext()" class="embla__next">Next</v-btn> -->
  </div>
</template>

<script setup lang="ts">
// import emblaCarouselVue from "embla-carousel-vue";
// import Autoplay from "embla-carousel-autoplay";
import type { YachtTemplate } from "~/types/templates/yacht";

const currentApp = ref<YachtTemplate["templates"][0]>();
interface Emits {
  (e: "createApp", app: YachtTemplate["templates"][0]): void;
}
defineEmits<Emits>();
interface Props {
  template: YachtTemplate;
}
const { template } = defineProps<Props>();

// const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true }, [
//   Autoplay({ stopOnMouseEnter: true, stopOnInteraction: false }),
// ]);

// watchEffect(() => {
//   if (emblaApi.value) {
//     console.log(emblaApi.value.slideNodes()); // Access API
//   }
// });
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
  /* overflow: hidden; */
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
