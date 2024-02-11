<template>
  <div>
    <template v-if="container && container.name">
      <v-row no-gutters>
        <v-col :cols="smAndDown ? 12 : 6" :class="`${smAndDown ? '' : 'pr-5'}`">
          <containers-details-card-namecard :container="container" :server="server" class="mb-5" />
          <containers-details-card-info-body :container="container" :server="server" class="mb-5" />
          <containers-details-card-environment v-if="!smAndDown" :container="container" :server="server" />
        </v-col>
        <v-col :cols="smAndDown ? 12 : 6">
          <containers-details-card-networking :container="container" :server="server" class="mb-5" />
          <containers-details-card-storage :container="container" :server="server" :class="`${smAndDown ? 'mb-5' : ''}`" />
          <containers-details-card-environment v-if="smAndDown" :container="container" :server="server" />
        </v-col>
      </v-row>
    </template>
    <!-- <v-card-title v-if="container && container.name">{{ container.name }}</v-card-title>
    <p>{{ server }}</p>
    <p>{{ name }}</p> -->
    <!-- <pre v-if="!smAndDown">{{ JSON.stringify(container, null, 2) }}</pre> -->
    <!-- <v-col></v-col> -->
  </div>
</template>

<script lang="ts" setup>
interface Props {
  server: string
  name: string
}
const { server, name } = defineProps<Props>()
const containersStore = useContainersStore()
const notifications = notificationsConnected()
const { smAndDown } = useDisplay()
const { container, loading } = storeToRefs(containersStore)

const refresh = async () => {
  await until(notifications).toBe(true)
  await useAsyncData('container', () => containersStore.fetchContainerDetails(server, name), {
    default() {
      return {}
    },
  })
}

onMounted(() => {
  refresh()
})
</script>

<style></style>