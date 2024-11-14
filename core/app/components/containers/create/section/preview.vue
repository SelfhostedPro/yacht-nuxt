<template>
  <Card>
    <CardContent>
      <Accordion type="multiple" :default-value="panel">
        <!-- Base Section -->
        <AccordionItem value="base">
          <AccordionTrigger>base</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>name</TableCell>
                  <TableCell>{{ form.name }}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>image</TableCell>
                  <TableCell>{{ form.image }}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>restart policy</TableCell>
                  <TableCell>{{ form.restart }}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>server</TableCell>
                  <TableCell>{{ form.server }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <!-- Info Section -->
        <AccordionItem value="info">
          <AccordionTrigger>info</AccordionTrigger>
          <AccordionContent>
            <div class="flex gap-4">
              <div class="w-16">
                <Avatar>
                  <AvatarImage :src="form.info?.icon || '/icons/default.svg'" />
                  <AvatarFallback>Icon</AvatarFallback>
                </Avatar>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold">{{ form.info?.title }}</h3>
                <div v-if="form.info?.notes" v-html="$mdRenderer.render(form.info.notes)" />
                <div v-else class="text-red-500 italic">No notes defined.</div>
                <div v-if="form.info?.notes" class="font-bold mt-4">
                  Please check to make sure no sensitive info is in this section.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Network Section -->
        <AccordionItem value="network">
          <AccordionTrigger>network</AccordionTrigger>
          <AccordionContent>
            <h3 class="text-lg font-semibold mb-4">{{ form.network || form.network_mode }}</h3>
            <Separator class="my-4" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card v-for="(port, index) in form.ports" :key="index">
                <CardHeader>
                  <CardTitle>{{ port?.label || 'Unnamed Port' }}</CardTitle>
                  <CardDescription>
                    host: {{ port?.host }}<br>
                    container: {{ port?.container }}<br>
                    protocol: {{ port?.protocol }}
                  </CardDescription>
                </CardHeader>
                <CardContent v-if="port?.description">
                  {{ port?.description }}
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Storage Section -->
        <AccordionItem value="storage">
          <AccordionTrigger>storage</AccordionTrigger>
          <AccordionContent>
            <div class="grid gap-4">
              <Card v-for="(mount, index) in form.mounts" :key="index">
                <CardHeader>
                  <CardTitle>{{ mount?.label || mount?.source }}</CardTitle>
                  <CardDescription>
                    source: {{ mount?.source }}<br>
                    destination: {{ mount?.destination }}<br>
                    read only: {{ mount?.read_only }}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Environment Section -->
        <AccordionItem value="environment">
          <AccordionTrigger>environment</AccordionTrigger>
          <AccordionContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card v-for="(env, index) in form.env" :key="index">
                <CardHeader>
                  <CardTitle>{{ env?.label || env?.name }}</CardTitle>
                  <CardDescription v-if="env?.label">
                    name: {{ env?.name }}<br>
                    value: {{ env?.value }}
                  </CardDescription>
                </CardHeader>
                <CardContent v-if="env?.description">
                  {{ env?.description }}
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <!-- Advanced Section -->
        <AccordionItem value="advanced">
          <AccordionTrigger>advanced</AccordionTrigger>
          <AccordionContent>
            <pre class="whitespace-pre-wrap">
labels: {{ form.labels }}
capabilities: {{ form.capabilities }}
command: {{ form.command }}
limits: {{ form.limits }}
sysctls: {{ form.sysctls }}
devices: {{ form.devices }}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '#docker/types/containers/create'
import type { ComputedRef } from 'vue'

const { $mdRenderer } = useNuxtApp()
const form = useFormValues() as ComputedRef<Partial<CreateContainerForm>>
const panel = ref(['base']) // Changed to use string values for accordion
</script>
