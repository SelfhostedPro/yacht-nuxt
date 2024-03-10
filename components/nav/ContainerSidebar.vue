<template>
  <v-navigation-drawer permanent :rail="!sidebarExpanded">
    <v-btn @click="sidebarExpanded = !sidebarExpanded">
      <v-icon
        :icon="
          sidebarExpanded ? 'mdi-arrow-collapse-left' : 'mdi-arrow-expand-right'
        "
      />
    </v-btn>
    <v-divider />
    <v-tabs mandatory v-model="tab" direction="vertical">
      <v-tab
        direction="vertical"
        v-for="(server, i) in Object.keys(servers)"
        :key="i"
        :value="i"
      >
        {{ server }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item
        v-for="(server, i) in Object.keys(servers)"
        :value="i"
        :key="i"
      >
        <v-list item-props nav dense>
          <v-list-item
            v-for="container in servers[server]"
            :key="`${i}-${container.name}`"
            :title="container.name"
            :subtitle="container.image"
            :to="`/containers/${server}/${container.name}`"
            exact
          >
            <template #prepend>
              <v-tooltip :text="container.state" location="bottom">
                <template #activator="{ props }">
                  <v-img v-bind="props" style="overflow: visible">
                    <v-avatar
                      :image="
                        container.info.icon
                          ? container.info.icon
                          : 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'
                      "
                    />
                    <v-avatar
                      class="ml-1"
                      style="position: absolute; left: 0; bottom: 0"
                      :color="container.status == 'running' ? 'primary' : 'red'"
                      size="6"
                    />
                  </v-img>
                </template>
              </v-tooltip>
            </template>
          </v-list-item>
        </v-list>
      </v-window-item>
    </v-window>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const sidebarExpanded = ref(false);

const tab = ref(0);

const containersStore = useContainersStore();
const { servers, loading } = storeToRefs(containersStore);
const notifications = notificationsConnected();
const { refresh: refreshList } = useAsyncData("containerList", () =>
  containersStore.fetchContainers()
);
</script>

<style></style>
