<template>
	<v-card>
		<v-tabs v-model="tab" color="primary" bg-color="foreground" grow>
			<v-tab :value="0">base</v-tab>
			<v-tab :value="1">info</v-tab>
		</v-tabs>
		<v-window v-model="tab" class="py-3">
			<v-window-item :value="0">
				<containers-details-card-info-base :container="container" />
			</v-window-item>
			<v-window-item :value="1">
				<containers-details-card-info-meta :info="container.info" />
			</v-window-item>
		</v-window>
	</v-card>
</template>

<script setup lang="ts">
import type { Container } from '~/types/containers/yachtContainers';
const tab = ref(0)
const { xs } = useDisplay()
defineProps<{
	container: Container;
	server: string;
}>()
</script>
~/shared/containers/yachtContainers