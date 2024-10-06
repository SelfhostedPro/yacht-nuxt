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
                <v-avatar size="60" :image="form.info?.icon"></v-avatar>
              </v-col>
              <v-col>
                <v-card-title>{{ form.info?.title }}</v-card-title>
                <v-card-text v-if="form.info && form.info.notes" v-html="$mdRenderer.render(form.info?.notes || '')" />
                <v-card-text v-else text="No notes defined."><i style="color:red;">No notes
                    defined.</i></v-card-text>
              </v-col>
            </v-row>
            <v-card-text v-if="form.info?.notes" class="font-weight-black">Please check to make sure no sensitive
              info is in this section.</v-card-text>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="network">
          <v-expansion-panel-text>
            <v-card-title>{{ form.network ? form.network : form.network_mode }}</v-card-title>
            <v-divider class="mb-3" thickness="3" color="primary" />
            <v-row dense>
              <v-col xs="12" sm="12" md="6" v-for="port in form.ports">
                <v-card color="foreground">
                  <v-card-title>
                    {{ port?.label || null }}
                  </v-card-title>
                  <v-card-subtitle>
                    host: {{ port?.host }}
                  </v-card-subtitle>
                  <v-card-subtitle>
                    container {{ port?.container }}
                  </v-card-subtitle>
                  <v-card-subtitle>
                    protocol {{ port?.protocol }}
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
              <v-col v-for="mount in form.mounts">
                <v-card color="foreground">
                  <v-card-title>{{ mount.label || mount.source }}</v-card-title>
                  <v-card-subtitle>source: {{ mount.source }}</v-card-subtitle>
                  <v-card-subtitle>destination: {{ mount.destination }}</v-card-subtitle>
                  <v-card-subtitle class="mb-3">read only: {{ mount.read_only }}</v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="environment">
          <v-expansion-panel-text>
            <v-row dense>
              <v-col xs="12" sm="12" md="6" v-for="env in form.env">
                <v-card color="foreground">
                  <v-card-title>{{ env.label || env.name }}</v-card-title>
                  <v-card-subtitle v-if="env.label">name: {{ env.name }}</v-card-subtitle>
                  <v-card-subtitle :class="env.description ? undefined : 'mb-3'">value: {{ env.value
                  }}</v-card-subtitle>
                  <v-card-text v-if="env.description">{{ env.description }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="advanced">
          <v-expansion-panel-text style="white-space: pre-wrap;">
            labels: {{ form.labels }}<br />
            capabilities: {{ form.capabilities }}<br />
            command: {{ form.command }}<br />
            limits: {{ form.limits }}<br />
            sysctls: {{ form.sysctls }}<br />
            devices: {{ form.devices }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '~/types/containers/create';

const form: ComputedRef<Partial<CreateContainerForm>> = useFormValues()
const panel = ref([])
</script>

<style></style>~/shared/containers/create