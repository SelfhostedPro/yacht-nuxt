<template>
  <v-tooltip v-for="author in authors" :key="author.name" :text="author.name" location="top">
    <template v-slot:activator="{ props }">
      <a v-bind="mergeProps(props, $attrs)" v-if="author.url" :href="author.url" target="_blank">
        <v-avatar size="32">
          <v-img :src="author.avatar || `https://avatars.dicebear.com/api/initials/${author.name}.svg`" />
        </v-avatar>
      </a>
      <v-avatar v-else size="32" v-bind="mergeProps(props, $attrs)">
        <v-img :src="author.avatar || `https://avatars.dicebear.com/api/initials/${author.name}.svg`" />
      </v-avatar>
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
import { mergeProps } from 'vue';
import type { YachtTemplate } from '~/types/templates/yacht';

interface Props {
  authors: YachtTemplate['authors']
}
defineProps<Props>()
</script>

<style></style>~/shared/templates/yacht