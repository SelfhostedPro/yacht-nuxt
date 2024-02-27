<template>
	<div>
		<v-list-item>
			<v-list-item-title> image </v-list-item-title>
			<v-list-item-subtitle class="text-no-wrap">{{ container.image }}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item>
			<v-list-item-title> id </v-list-item-title>
			<v-list-item-subtitle class="text-no-wrap">{{ container.id }}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item>
			<v-list-item-title> status </v-list-item-title>
			<v-list-item-subtitle>{{ container.status }}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item>
			<v-list-item-title> created </v-list-item-title>
			<v-list-item-subtitle>{{ container.created }}</v-list-item-subtitle>
		</v-list-item>
		<v-list-item>
			<v-list-item-title> restart </v-list-item-title>
			<v-list-item-subtitle>{{ container.restart && container.restart.policy ? container.restart.policy : '-'
			}}
			</v-list-item-subtitle>
		</v-list-item>
	</div>
</template>

<script setup lang="ts">
import type { Container } from '~/types/containers/yachtContainers';

interface Props {
	container: Container
}
defineProps<Props>()
</script>
~/shared/containers/yachtContainers