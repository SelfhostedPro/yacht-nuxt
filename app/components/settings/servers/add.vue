<template>
    <v-card>
        <v-toolbar color="primary">
            <v-toolbar-title>add server</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col>
                    <v-text-field label="name" v-model="testForm.name"></v-text-field>
                </v-col>
                <v-col>
                    <v-select label="protocol" v-model="testForm.options.protocol" item-title="title" item-value="value"
                        :items="protocolOptions" :hint="`${testForm.options.protocol}`"></v-select>
                </v-col>
            </v-row>
            <v-text-field v-if="testForm.options.protocol == 'local'" v-model="testForm.options.socketPath"
                label="socket path" placeholder="/var/run/docker.sock"></v-text-field>

            <v-row dense v-if="testForm.options.protocol === 'ssh'">
                <v-col cols="9">
                    <v-text-field v-model="testForm.options.host" label="host" placeholder="192.168.0.1"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field label="port" v-model="testForm.options.port" placeholder="22"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field label="username" v-model="testForm.options.username" placeholder="user" />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="password" type="password" v-model="testForm.options.password" />
                </v-col>
                <v-col :cols="testForm.keyname === 'new' ? 6 : 12">
                    <v-select v-model="testForm.keyname" label="key" :items="[...keys, 'new']"></v-select>
                </v-col>
                <v-col v-if="testForm.keyname === 'new'" cols="6">
                    <v-text-field v-model="newKeyName" label="key name" placeholder="internal"></v-text-field>
                </v-col>
                <v-col class="mt-0 pt-0" v-if="testForm.keyname">
                    <v-switch v-model="testForm.copyToServer" hide-details="auto" label="copy key to server"></v-switch>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$emit('close')">cancel</v-btn>
            <v-btn color="primary" @click="submit()">add</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup lang="ts">


const emit = defineEmits(['close'])
const settingStore = useSettingsStore()
const { keys } = storeToRefs(settingStore)
const protocolOptions = ['local', 'ssh']
const newKeyName: Ref<string> = ref('')
const storedForm = localStorage.getItem('createServerForm')
const testForm = ref({
    name: '',
    options: {
        protocol: 'local'
    }
} as NewServer)

const submit = async () => {
    testForm.value.keyname === 'new' ? testForm.value.keyname = newKeyName.value : testForm.value.keyname = testForm.value.keyname
    // console.log(testForm.value)
    await settingStore.addServer(testForm.value)
    emit('close')
}

onMounted(async () => {
    await settingStore.fetchKeys()
    if (storedForm) {
        testForm.value = JSON.parse(storedForm)
    }
})

onBeforeUnmount(() => {
    localStorage.setItem('createServerForm', JSON.stringify(testForm.value))
})
</script>