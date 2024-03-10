<template>
  <v-navigation-drawer
    v-if="!smAndDown"
    class="fill-height"
    elevation="10"
    permanent
    :expand-on-hover="mode !== 'mini'"
    :rail="mode !== 'full'"
    @click="mode = modes.next"
    @update:rail="(value) => (sidebarExpanded = !value)"
  >
    <slot name="header">
      <v-img
        max-height="100"
        height="40"
        class="my-3 mx-1"
        src="~/assets/icons/yacht/text.svg"
        :style="
          theme.global.current.value.dark
            ? 'filter: brightness(5)'
            : 'filter: brightness(1)'
        "
      />
    </slot>
    <!-- <v-btn
      @mouseenter="sidebarButtonHovered = true"
      @mouseleave="sidebarButtonHovered = false"
      class="my-2 mx-2"
      :icon="
        sidebarButtonHovered
          ? modeIcons[modes.next]
          : mode !== 'auto'
          ? 'mdi-lock'
          : modeIcons[modes.current]
      "
      density="comfortable"
      @click="mode = modes.next"
    /> -->
    <slot name="header-buttons"> </slot>

    <v-divider />
    <slot name="list">
      <v-list nav dense @click.stop>
        <div v-for="(link, i) in links" :key="i">
          <v-list-item
            v-if="!link.subLinks"
            :to="link.to"
            :title="link.text"
            :prepend-icon="link.icon"
            class="mt-1"
          />

          <v-list-group
            v-else
            fluid
            subgroup
            :key="link.text"
            :prepend-icon="link.icon"
            :value="false"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :title="link.text"
                :prepend-icon="link.icon"
              />
            </template>

            <v-list-item
              v-for="sublink in link.subLinks"
              :key="sublink.text"
              :to="sublink.to"
              :title="sublink.text"
              :prepend-icon="sublink.icon"
              exact
              class="mb-1"
            />
          </v-list-group>
          <v-divider />
        </div>
      </v-list>
    </slot>

    <template #append>
      <div class="d-flex flex-column mx-auto">
        <v-btn
          size="large"
          variant="text"
          :icon="
            theme.global.current.value.dark
              ? 'mdi-weather-night'
              : 'mdi-weather-sunny'
          "
          @click.stop="toggleTheme()"
        >
        </v-btn>
        <v-btn
          size="large"
          variant="text"
          icon="mdi-file-document"
          target="_blank"
          href="https://yacht.sh"
          @click.stop
        />
        <v-btn
          size="large"
          variant="text"
          icon="mdi-github"
          target="_blank"
          href="https://github.com/SelfhostedPro/Yacht"
          @click.stop
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useTheme } from "vuetify";

// Sidebar Settings
const sidebarExpanded: Ref<boolean> = ref(false);
const sidebarExpand = async (value: boolean) => {
  await nextTick();
  sidebarExpanded.value = !value;
};

// Size
type sidebarMode = "auto" | "mini" | "full";
const mode: Ref<sidebarMode> = ref("auto");
const modes: ComputedRef<{ current: sidebarMode; next: sidebarMode }> =
  computed(() => {
    switch (mode.value) {
      case "auto":
        return { current: "auto", next: "full" };
      case "full":
        return { current: "full", next: "mini" };
      case "mini":
        return { current: "mini", next: "auto" };
    }
  });
const modeIcons = {
  auto: "mdi-lock-open",
  mini: "mdi-arrow-collapse-left",
  full: "mdi-lock",
};

// Theme
const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark
    ? "yachtLightTheme"
    : "yachtDarkTheme";
};

// Sidebar Links
const { smAndDown } = useDisplay();
defineProps(["links"]);
</script>
