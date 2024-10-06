<template>
  <LazyLayoutsDefault :links="links">
    <template #appbar-logo>
      <ClientOnly>
        <v-img
          max-height="50"
          aspect-ratio="4/3"
          class="d-flex align-center mx-auto"
          src="/icons/yacht/mini.svg"
          style="filter: brightness(5)"
        />
      </ClientOnly>
    </template>
    <template #sidebar-logo>
      <ClientOnly>
        <v-img
          aspect-ratio="16/9"
          max-height="100"
          height="40"
          class="block w-full my-3 px-1"
          src="/icons/yacht/text.svg"
        />
      </ClientOnly>
    </template>
    <template #appbar-append>
      <v-btn
        variant="elevated"
        color="surface"
        @click.stop="
          notificationsStore.pushToast({
            title: 'test',
            message: 'This is a test',
            dedupe: false,
            level: 'info',
            timeout: Number.POSITIVE_INFINITY,
          })
        "
      >
        notify
      </v-btn>
    </template>
    <slot />
    <SonnerClient />
  </LazyLayoutsDefault>
</template>

<script lang="ts" setup>
import { ClientOnly } from "#components";
import SonnerClient from "~/modules/notifications/runtime/components/sonner.client.vue";
// const RawProgress = markRaw(NotificationsLVProgress);
// const testProgressNotification: ProgressItems = {
//   c2964e85ea54: {
//     id: "c2964e85ea54",
//     current: 15661370,
//     total: 49590965,
//     message:
//       "[===============>                                   ]  15.66MB/49.59MB",
//     status: "Downloading",
//   },
//   d3436c315a5d: {
//     id: "d3436c315a5d",
//     current: 17127738,
//     total: 23582766,
//     message:
//       "[====================================>              ]  17.13MB/23.58MB",
//     status: "Downloading",
//   },
//   "603ae72c83b1": {
//     id: "603ae72c83b1",
//     current: 16140604,
//     total: 63990920,
//     message:
//       "[============>                                      ]  16.14MB/63.99MB",
//     status: "Downloading",
//   },
//   bcabfc6c415b: { id: "bcabfc6c415b", status: "Waiting" },
//   d4787ee6f8d4: { id: "d4787ee6f8d4", status: "Waiting" },
//   "153637b38f3d": { id: "153637b38f3d", status: "Waiting" },
//   "73905358592c": { id: "73905358592c", status: "Waiting" },
//   d9d5ad0ce614: { id: "d9d5ad0ce614", status: "Waiting" },
//   "2fc0207b7315": { id: "2fc0207b7315", status: "Waiting" },
//   a1aa34877f44: { id: "a1aa34877f44", status: "Waiting" },
//   "78379935b7b2": { id: "78379935b7b2", status: "Waiting" },
//   c846c7de144e: { id: "c846c7de144e", status: "Waiting" },
// };
// const testProgressProps = {
//   id: "testNotification",
//   testTitle: "pepperlabs/peppermint:latest",
//   testProgress: testProgressNotification,
// };
const notificationsStore = useNotificationsStore();
const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark
    ? "yachtLightTheme"
    : "yachtDarkTheme";
};
const links = [
  {
    to: "/",
    icon: "mdi-view-dashboard",
    text: "Dashboard",
    divider: true,
  },
  {
    text: "Containers",
    to: "/containers",
    icon: "mdi-application",
  },
  {
    text: "Templates",
    to: "/templates",
    icon: "mdi-folder",
  },
  {
    text: "Projects",
    to: "/projects",
    icon: "mdi-book-open",
  },
  {
    icon: "mdi-cube-outline",
    text: "Resources",
    subLinks: [
      {
        text: "Images",
        to: "/resources/images",
        icon: "mdi-disc",
      },
      {
        text: "Volumes",
        to: "/resources/volumes",
        icon: "mdi-database",
      },
      {
        text: "Networks",
        to: "/resources/networks",
        icon: "mdi-network",
      },
    ],
  },
  // {
  //   to: "/settings/general",
  //   icon: "mdi-cog",
  //   text: "Settings"
  // }
];
</script>
