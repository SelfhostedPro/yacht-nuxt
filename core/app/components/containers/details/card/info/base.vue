<template>
	<Card>
		<CardContent>
			<div class="space-y-4">
				<div>
					<Label>Image</Label>
					<p class="truncate">{{ container.image }}</p>
				</div>
				<div>
					<Label>ID</Label>
					<p class="truncate">{{ container.id }}</p>
				</div>
				<div>
					<Label>Status</Label>
					<p>{{ container.status }}</p>
				</div>
				<div>
					<Label>Created</Label>
					<p>{{ container.created }}</p>
				</div>
				<div>
					<Label>Restart</Label>
					<p>{{ container.restart && container.restart.policy ? container.restart.policy : '-' }}</p>
				</div>
			</div>
		</CardContent>
	</Card>
</template>

<script setup lang="ts">
import type { Container } from '#docker/types/containers/yachtContainers';
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface Props {
	container: Container
}
defineProps<Props>()
</script>

<style scoped>
/* Add any custom styles if needed */
</style>