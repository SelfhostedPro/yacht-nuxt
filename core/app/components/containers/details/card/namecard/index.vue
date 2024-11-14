<template>
  <Card>
    <CardHeader class="p-0">
      <!-- Toolbar -->
      <div class="flex items-center justify-between p-2">
        <div class="flex items-center gap-2">
          <containers-actions
            :container="container"
            :server="server"
          />
          <div v-if="!isMobile" class="flex-1" />
          <lazy-containers-logs
            v-if="logsOpen"
            v-model="logsOpen"
            :server="server"
            :name="container.name"
            @close="logsOpen = false"
          />
          <lazy-containers-terminal
            v-if="terminalOpen"
            v-model="terminalOpen"
            :server="server"
            :name="container.name"
            @close="terminalOpen = false"
          />
        </div>

        <!-- Action Buttons -->
        <div v-if="!isMobile" class="flex gap-1">
          <TooltipProvider>
            <Tooltip v-for="button in toolbarButtons" :key="button.text">
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  :class="button.color === 'warning' ? 'text-warning' : 
                         button.color === 'info' ? 'text-info' : ''"
                  @click="button.click"
                >
                  <Icon :icon="button.icon" class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ button.text }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <!-- Mobile Menu -->
        <DropdownMenu v-else>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icon icon="lucide:more-vertical" class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              v-for="button in toolbarButtons.toReversed()"
              :key="button.text"
              @click="button.click"
              :class="button.color === 'warning' ? 'text-warning' : 
                     button.color === 'info' ? 'text-info' : ''"
            >
              <Icon :icon="button.icon" class="h-4 w-4 mr-2" />
              {{ button.text }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Title Section -->
      <div class="flex items-center p-4" :class="isMobile ? 'flex-col' : ''">
        <div class="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              :src="container.info.icon || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'"
              alt="Container icon"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  class="h-2 w-2 rounded-full"
                  :class="container.status === 'running' ? 'bg-primary' : 'bg-destructive'"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ container.status }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span class="text-lg font-medium">{{ container.name }}</span>
        </div>
      </div>
    </CardHeader>
  </Card>
</template>

<script lang="ts" setup>
import type { Container } from "#docker/types/containers/yachtContainers";
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('md')

const logsOpen = ref(false);
const terminalOpen = ref(false);

interface Props {
  container: Container;
  server: string;
}
defineProps<Props>();

const toolbarButtons = [
  {
    text: "terminal",
    icon: "lucide:terminal",
    click: () => (terminalOpen.value = true),
  },
  {
    text: "logs",
    icon: "lucide:file-text",
    click: () => (logsOpen.value = true),
  },
  {
    text: "help",
    icon: "lucide:help-circle",
    color: "info",
    click: () => console.log("not implemented yet"),
  },
  {
    text: "edit",
    icon: "lucide:file-edit",
    color: "warning",
    click: () => console.log("not implemented yet"),
  },
];
</script>
