<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card color="foreground">
    <v-card-text>
      <v-expansion-panels v-model="panel" variant="inset" multiple>
        <v-expansion-panel title="base">
          <v-expansion-panel-text>
            <v-table>
              <tbody>
                <tr>
                  <td>name</td>
                  <td>{{ form.name }}</td>
                </tr>
                <tr>
                  <td>image</td>
                  <td>{{ form.image }}</td>
                </tr>
                <tr>
                  <td>restart policy</td>
                  <td>{{ form.restart }}</td>
                </tr>
                <tr>
                  <td>server</td>
                  <td>{{ form.server }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="info">
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="2">
                <v-avatar size="60" :image="form.info?.icon" />
              </v-col>
              <v-col>
                <v-card-title>{{ form.info?.title }}</v-card-title>
                <v-card-text v-if="form.info?.notes" v-html="$mdRenderer.render(form.info.notes)" />
                <v-card-text v-else><i class="text-red">No notes defined.</i></v-card-text>
              </v-col>
            </v-row>
            <v-card-text v-if="form.info?.notes" class="font-weight-black">Please check to make sure no sensitive
              info is in this section.</v-card-text>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="network">
          <v-expansion-panel-text>
            <v-card-title>{{ form.network || form.network_mode }}</v-card-title>
            <v-divider class="mb-3" thickness="3" color="primary" />
            <v-row dense>
              <v-col v-for="(port, index) in form.ports" :key="index" xs="12" sm="12" md="6">
                <v-card color="foreground">
                  <v-card-title>
                    {{ port?.label || 'Unnamed Port' }}
                  </v-card-title>
                  <v-card-subtitle>
                    host: {{ port?.host }}
                  </v-card-subtitle>
                  <v-card-subtitle>
                    container: {{ port?.container }}
                  </v-card-subtitle>
                  <v-card-subtitle>
                    protocol: {{ port?.protocol }}
                  </v-card-subtitle>
                  <v-card-text>
                    {{ port?.description }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="storage">
          <v-expansion-panel-text>
            <v-row>
              <v-col v-for="(mount, index) in form.mounts" :key="index">
                <v-card color="foreground">
                  <v-card-title>{{ mount?.label || mount?.source }}</v-card-title>
                  <v-card-subtitle>source: {{ mount?.source }}</v-card-subtitle>
                  <v-card-subtitle>destination: {{ mount?.destination }}</v-card-subtitle>
                  <v-card-subtitle class="mb-3">read only: {{ mount?.read_only }}</v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="environment">
          <v-expansion-panel-text>
            <v-row dense>
              <v-col v-for="(env, index) in form.env" :key="index" xs="12" sm="12" md="6">
                <v-card color="foreground">
                  <v-card-title>{{ env?.label || env?.name }}</v-card-title>
                  <v-card-subtitle v-if="env?.label">name: {{ env?.name }}</v-card-subtitle>
                  <v-card-subtitle :class="env?.description ? undefined : 'mb-3'">value: {{ env?.value
                    }}</v-card-subtitle>
                  <v-card-text v-if="env?.description">{{ env?.description }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="advanced">
          <v-expansion-panel-text style="white-space: pre-wrap;">
            labels: {{ form.labels }}<br>
            capabilities: {{ form.capabilities }}<br>
            command: {{ form.command }}<br>
            limits: {{ form.limits }}<br>
            sysctls: {{ form.sysctls }}<br>
            devices: {{ form.devices }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '#docker/types/containers/create'
import type { ComputedRef } from 'vue'
const { $mdRenderer } = useNuxtApp()


const form = useFormValues() as ComputedRef<Partial<CreateContainerForm>>
const panel = ref<number[]>([])
</script>

<style scoped></style>
