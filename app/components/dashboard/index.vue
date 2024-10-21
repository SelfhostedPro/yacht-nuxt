<template>
    <v-container fluid>
      <v-row v-for="([serverName, serverStats], i) in Object.entries(stats)" :key="serverName" class="mb-6">
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h5">{{ serverName }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-card-subtitle>CPU Total: {{ serverStats.cpuTotal }}</v-card-subtitle>
                </v-col>
                <v-col cols="6">
                  <v-card-subtitle>Memory Total: {{ formatBytes(serverStats.memoryTotal) }}</v-card-subtitle>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Container</th>
                          <th class="text-left">CPU Usage</th>
                          <th class="text-left">Memory Usage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(containerStats, containerName) in serverStats.containers" :key="containerName">
                          <td>{{ containerName }}</td>
                          <td>
                            <v-progress-linear
                              :value="parseFloat(containerStats.cpuUsage)"
                              color="primary"
                              height="20"
                            >
                              <template v-slot:default="{ value }">
                                <strong>{{ Math.ceil(value) }}%</strong>
                              </template>
                            </v-progress-linear>
                          </td>
                          <td>
                            <v-progress-linear
                              :value="parseFloat(containerStats.memoryPercentage)"
                              color="secondary"
                              height="20"
                            >
                              <template v-slot:default="{ value }">
                                <strong>{{ Math.ceil(value) }}%</strong>
                              </template>
                            </v-progress-linear>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ServerStatsDict, ServerStats } from '~~/types/servers';

const stats = ref<ServerStatsDict>({});

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const { refresh: refreshStats, execute: getServerStats } = useAsyncData(
    "serverStats",
    async () => fetchServerStats(),
    { server: false, immediate: false }
);

const fetchServerStats = () =>
    fetchSSE("/api/servers/stats", {
        async onopen(response) {
            console.log(response.ok ? "Connected to stats SSE" : "Error connecting to stats SSE", response.statusText);
        },
        onmessage(ev) {
            console.log('Received event:', ev);
            let serverStats: ServerStatsDict;
            try {
                // Parse the data twice to handle double JSON encoding
                const parsedOnce = JSON.parse(ev.data);
                serverStats = JSON.parse(parsedOnce);
            } catch (error) {
                console.error('Error parsing server stats:', error);
                return;
            }

            if (typeof serverStats === 'object' && serverStats !== null) {
                console.log('Received server stats:', serverStats);
                // Update the stats directly
                stats.value = serverStats;
            } else {
                console.error('Received invalid server stats format:', serverStats);
            }
        },
        onclose() {
            console.log("Closed stats SSE");
        },
        onerror(err) {
            console.error("Error connecting to stats SSE:", err);
        },
        signal: new AbortController().signal,
        openWhenHidden: true,
    });

// Call getServerStats when the component is mounted
onMounted(() => {
    getServerStats();
});
</script>
