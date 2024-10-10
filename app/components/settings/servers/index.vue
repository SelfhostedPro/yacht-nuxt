<template>
    <SettingsSection title="Servers">
        <v-row>
            <v-col cols="4" v-for="server in settings.servers" :key="server.name">
                <v-card>
                    <v-row>
                        <v-col><v-card-title>{{ server.name }} </v-card-title></v-col>
                        <v-col cols="2"><v-btn variant="plain" @click="serverRemoveModal[server.name] = true"
                                icon="mdi-close"></v-btn></v-col>
                    </v-row>
                    <v-card-subtitle v-if="server.options?.protocol == 'ssh' && server.key">key: {{ server.key
                        }}</v-card-subtitle>
                    <v-card-text> {{ server.options }}</v-card-text>
                    <v-dialog v-model="serverRemoveModal[server.name]" :width="500">
                        <SettingsServersDel @close="serverRemoveModal[server.name] = false" :server="server"
                            :servers="settings.servers" />
                    </v-dialog>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card color="secondary" @click="serverAddModal = true" :link="true">
                    <v-card-title> add </v-card-title>
                    <v-card-text class="text-center"> <v-icon icon="mdi-plus" />
                    </v-card-text>
                    <v-dialog v-model="serverAddModal" :width="500">
                        <addServer @close="serverAddModal = false" />
                    </v-dialog>
                </v-card>
            </v-col>
        </v-row>
    </SettingsSection>
</template>
<script setup lang="ts">
const { settings } = storeToRefs(useSettingsStore())

if (!settings.value) {
    await useSettingsStore().fetchSettings()
}

const serverRemoveModal = ref<{ [server: string]: boolean }>({})
const serverAddModal = ref(false)
</script>