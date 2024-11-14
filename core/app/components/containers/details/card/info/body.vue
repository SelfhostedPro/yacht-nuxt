<template>
	<Card>
		<Tabs v-model="tab">
			<TabsList>
				<TabsTrigger value="0">Base</TabsTrigger>
				<TabsTrigger value="1">Info</TabsTrigger>
			</TabsList>
			<TabsContent value="0">
				<containers-details-card-info-base :container="container" />
			</TabsContent>
			<TabsContent value="1">
				<containers-details-card-info-meta :info="container.info" />
			</TabsContent>
		</Tabs>
	</Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Container } from '#docker/types/containers/yachtContainers';

const tab = ref('0');

defineProps<{
	container: Container;
	server: string;
}>();
</script>