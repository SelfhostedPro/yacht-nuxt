<template>
  <div>
    <template v-if="container && container.name">
      <v-row>
        <v-col>
          <containers-details-card-info :container="container" :server="server" />
        </v-col>
      </v-row>
    </template>
    <v-card-title v-if="container && container.name">{{ container.name }}</v-card-title>
    <v-card-text v-else>container {{ JSON.stringify(container, null, 2) }}</v-card-text>
    <p>{{ server }}</p>
    <p>{{ name }}</p>
    <v-col></v-col>
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