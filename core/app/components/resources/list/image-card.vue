<template>
  <Card id="images-card" class="p-2 h-full transition-height duration-300 ease-in-out relative">
    <div class="flex flex-col space-y-2">
      <div class="flex max-h-28">
        <CardHeader>
          <template #avatar>
            <Avatar>
              <img :src="vendorIcon" alt="Vendor Icon" class="object-cover" />
            </Avatar>
          </template>
          <CardTitle>
            {{ imageTitle }}
            <Button size="sm" variant="ghost" class="ml-2" @click="reveal = !reveal">
              <component :is="reveal ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </Button>
          </CardTitle>
          <CardDescription>
            {{ resource.RepoTags && resource.RepoTags[0] }}
          </CardDescription>
          <CardDescription>
            Size: {{ imageSize.toFixed(2) + " MB" }}
          </CardDescription>
          <CardDescription>
            Created: {{ formatDates(resource.Created) }}
          </CardDescription>
        </CardHeader>
      </div>

      <div class="flex max-h-28 overflow-auto">
        <CardContent>
          <div v-if="labels?.get('description')" v-html="$mdRenderer.render(labels.get('description'))" />
          <div v-else class="text-secondary">
            {{ imageTitle?.toLowerCase() }} does not provide
            <a href="https://github.com/opencontainers/image-spec/blob/main/annotations.md">
              OCI labels for a description
            </a>.
          </div>
        </CardContent>
      </div>
    </div>

    <CardFooter v-if="hasLinks" class="p-0 flex justify-between items-center">
      <div class="flex space-x-2">
        <Button v-if="labels?.get('url')" size="sm" variant="ghost" target="_blank" :href="labels.get('url')">
          <ExternalLink class="w-4 h-4" />
        </Button>
        <Button v-if="labels?.get('documentation')" size="sm" variant="ghost" target="_blank"
          :href="labels.get('documentation')">
          <FileText class="w-4 h-4" />
        </Button>
        <Button v-if="labels?.get('source')" size="sm" variant="ghost" target="_blank" :href="labels.get('source')">
          <Github class="w-4 h-4" />
        </Button>
      </div>
      <span v-if="labels?.get('vendor')" class="text-sm font-light">
        by {{ labels.get("vendor") }}
      </span>
    </CardFooter>

    <div v-show="reveal" class="transition-all duration-300">
      <pre class="overflow-auto">{{ resource }}</pre>
      <pre class="overflow-auto">{{ labels }}</pre>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useNuxtApp } from '#app';
import { ExternalLink, FileText, Github, ChevronUp, ChevronDown } from 'lucide-vue-next';
import type { ImageInfo } from 'dockerode';
import { fromUnixTime } from 'date-fns';

const { $mdRenderer } = useNuxtApp();

const reveal = ref(false);
interface Props {
  server: string;
  resource: ImageInfo;
}
const props = defineProps<Props>();

const keyMap: { [key: string]: string } = {
  "org.opencontainers.image.title": "title",
  "org.opencontainers.image.description": "description",
  "org.opencontainers.image.url": "url",
  "org.opencontainers.image.documentation": "documentation",
  "org.opencontainers.image.source": "source",
  "org.opencontainers.image.vendor": "vendor",
  "org.opencontainers.image.licenses": "licenses",
  "org.opencontainers.image.version": "version",
  "org.opencontainers.image.created": "created",
  "org.opencontainers.image.authors": "authors",
  "org.opencontainers.image.revision": "revision",
  "org.opencontainers.image.ref.name": "ref.name",
  "org.opencontainers.image.ref.digest": "ref.digest",
  "sh.yacht.icon": "yacht.icon",
  "com.docker.desktop.extension.icon": "docker.icon",
};

const labels = computed(() => {
  if (!props.resource.Labels) return new Map();
  const LabelList = new Map();
  for (const key of Object.keys(props.resource.Labels)) {
    const mappedKey = keyMap[key];
    if (mappedKey) {
      LabelList.set(mappedKey, props.resource.Labels[key]);
    }
  }
  return LabelList;
});

const imageTitle = computed(() => {
  const titleLabel = labels.value.get("title");
  if (titleLabel) {
    return titleLabel;
  }
  const repoTag = props.resource.RepoTags?.[0];
  if (repoTag && repoTag !== "<none>:<none>") {
    return repoTag;
  }
  return props.resource.Id?.slice(7, 19) ?? props.resource.Id;
});

const vendorIconMap: { [key: string]: string } = {
  "linuxserver.io": `https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/${imageTitle.value.toLowerCase()}-logo.png`,
  "portainer.io": "docker.icon",
};

const imageSize = computed(() => {
  return props.resource.Size / 1000 / 1000;
});
const formatDates = (date: number) => {
  return fromUnixTime(date).toLocaleString();
};
const vendorIcon = computed(() => {
  const vendor = String(labels.value.get("vendor")).toLowerCase();
  return vendor && vendor !== "undefined"
    ? vendorIconMap[vendor] || labels.value.get("yacht.icon")
    : '/docker-placeholder-logo.png';
});

const hasLinks = computed(() => {
  return labels.value.size > 0 && (labels.value.get('url') || labels.value.get('documentation') || labels.value.get('source'));
});
</script>

<style scoped>
/* Add any additional styles here if necessary */
</style>
