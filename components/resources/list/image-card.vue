<template>
  <v-card id="images-card" class="pa-2 fill-height" density="compact"
    style="transition: height 0.3s ease-in-out; position: relative;" v-auto-animate>
    <v-row no-gutters>
      <v-col cols="12">
        <v-sheet max-height="110px">
          <v-card-item :prepend-avatar="vendorIcon || placeHolder">
            <v-card-title>
              {{ imageTitle }} <v-btn size="small" variant="plain" icon @click="reveal = !reveal">
                <v-icon :icon="reveal ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
              </v-btn>
            </v-card-title>
            <v-card-subtitle>{{ resource.RepoTags && resource.RepoTags[0] }}</v-card-subtitle>
            <v-card-subtitle>size: {{ imageSize.toFixed(2) + ' MB' }}</v-card-subtitle>
            <v-card-subtitle>created: {{ formatDates(resource.Created) }}</v-card-subtitle>
          </v-card-item>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet height="110px" class="overflow-auto">
          <v-card-text v-if="labels?.get('description')" v-html="$mdRenderer.render(labels.get('description'))" />
          <v-card-text v-else class="text--secondary">
            {{ imageTitle?.toLowerCase() }} does not provide <a
              href="https://github.com/opencontainers/image-spec/blob/main/annotations.md">oci labels for a
              description</a>.
          </v-card-text>
        </v-sheet>
      </v-col>
    </v-row>


    <v-card-actions v-if="labels && (labels.get('url') || labels.get('documentation') || labels.get('source'))"
      class="pa-0 align-end">
      <v-btn size="small" target="_blank" variant="plain" icon :href="labels.get('url')" v-if="labels?.get('url')">
        <v-icon icon="mdi-open-in-new" />
      </v-btn>
      <v-btn size="small" target="_blank" variant="plain" icon :href="labels.get('documentation')"
        v-if="labels?.get('documentation')">
        <v-icon icon="mdi-file-document" />
      </v-btn>
      <v-btn size="small" target="_blank" variant="plain" icon :href="labels.get('source')" v-if="labels?.get('source')">
        <v-icon icon="mdi-github" />
      </v-btn>
      <v-spacer />
      <span v-if="labels?.get('vendor')" class="text-overline font-weight-light ma-0">
        by {{ labels.get('vendor') }}
      </span>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="reveal">
        <pre class="overflow-auto"> {{ resource }}</pre>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts" setup>
import type { ImageInfo } from 'dockerode';
const reveal = ref(false)
import placeHolder from '@/assets/docker-placeholder-logo.png'
import { fromUnixTime } from 'date-fns';
interface Props {
  server: string,
  resource: ImageInfo
}
const props = defineProps<Props>()
const LabelList = ref(new Map())

const keyMap: { [key: string]: string } = {
  'org.opencontainers.image.title': 'title',
  'org.opencontainers.image.description': 'description',
  'org.opencontainers.image.url': 'url',
  'org.opencontainers.image.documentation': 'documentation',
  'org.opencontainers.image.source': 'source',
  'org.opencontainers.image.vendor': 'vendor',
  'org.opencontainers.image.licenses': 'licenses',
  'org.opencontainers.image.version': 'version',
  'org.opencontainers.image.created': 'created',
  'org.opencontainers.image.authors': 'authors',
  'org.opencontainers.image.revision': 'revision',
  'org.opencontainers.image.ref.name': 'ref.name',
  'org.opencontainers.image.ref.digest': 'ref.digest',
  'sh.yacht.icon': 'yacht.icon',
  'com.docker.desktop.extension.icon': 'docker.icon'
};

const vendorIconMap: { [key: string]: string } = {
  'linuxserver.io': 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png',
  'portainer.io': 'docker.icon',
};

const labels = computed(() => {
  const LabelList = new Map()
  const labels = props.resource.Labels;
  if (!labels) return;
  for (const [key, value] of Object.entries(labels)) {
    const mappedKey = keyMap[key];
    if (mappedKey) {
      LabelList.set(mappedKey, value);
    }
  }
  return LabelList
})

const imageTitle = computed(() => {
  if (labels.value?.get('title')) {
    return <string>labels.value?.get('title')
  } else if (props.resource.RepoTags && props.resource.RepoTags.length > 0 && props.resource.RepoTags[0] !== '<none>:<none>') {
    return <string>props.resource.RepoTags[0]
  }
  return <string>props.resource.Id?.slice(7, 19) || <string>props.resource.Id
})

const imageSize = computed(() => {
  return props.resource.Size / 1000 / 1000
})
const formatDates = (date: number) => {
  return fromUnixTime(date).toLocaleString()
}
const vendorIcon = computed(() => {
  const vendor = String(LabelList.value.get('vendor')).toLowerCase();
  return vendor ? vendorIconMap[vendor] || LabelList.value.get('yacht.icon') : placeHolder;
});
</script>

<style></style>