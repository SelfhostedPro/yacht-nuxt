<template>
    <v-card>
        <v-form @submit="onSubmit">
            <v-toolbar color="primary">
                <v-toolbar-title>add server</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-text-field label="name" v-model="name" v-bind="nameProps"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-select label="protocol" v-model="protocol" v-bind="protocolProps" item-title="title"
                            item-value="value" :items="protocolOptions" :hint="`${protocol}`"></v-select>
                    </v-col>
                </v-row>
                <v-text-field v-if="values.options?.protocol == 'local'" v-model="socketPath" v-bind="socketPathProps"
                    label="socket path" placeholder="/var/run/docker.sock"></v-text-field>

                <v-row dense v-if="values.options?.protocol === 'ssh'">
                    <v-col cols="9">
                        <v-text-field v-model="host" v-bind="hostProps" label="host"
                            placeholder="192.168.0.1"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field label="port" v-model="port" v-bind="portProps" placeholder="22"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="username" v-model="username" v-bind="usernameProps" placeholder="user" />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="password" type="password" v-model="password" v-bind="passwordProps" />
                    </v-col>
                    <v-col :cols="key === 'new' ? 6 : 12">
                        <v-select v-model="key" v-bind="keyProps" label="key" :items="[...keys, 'new']"></v-select>
                    </v-col>
                    <v-col v-if="key === 'new'" cols="6">
                        <v-text-field v-model="newKeyName" label="key name" placeholder="internal"></v-text-field>
                    </v-col>
                    <v-col class="mt-0 pt-0" v-if="key">
                        <v-switch v-bind="copyToServerProps" v-model="copyToServer" hide-details="auto"
                            label="copy key to server"></v-switch>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="$emit('close')">cancel</v-btn>
                <v-btn color="primary" type="submit">add</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>
<script setup lang="ts">
import { newServerSchema, type NewServer } from '~~/types/forms/server';

const emit = defineEmits(['close'])
const settingStore = useSettingsStore()
const { keys } = storeToRefs(settingStore)
const protocolOptions = ['local', 'ssh']
const newKeyName: Ref<string> = ref('')
const storedForm = localStorage.getItem('createServerForm')

const vuetifyConfig = (state: any) => ({
    props: {
        'error-messages': state.errors,
    },
});

const { handleSubmit, handleReset, values, errors, setValues, defineField } = useForm({
    initialValues: {
        name: '',
        options: {}
    },
    validationSchema: toTypedSchema(newServerSchema),
    keepValuesOnUnmount: true,
});

const [name, nameProps] = defineField('name', vuetifyConfig);
const [protocol, protocolProps] = defineField('options.protocol', vuetifyConfig);
const [socketPath, socketPathProps] = defineField('options.socketPath', vuetifyConfig);
const [host, hostProps] = defineField('options.host', vuetifyConfig);
const [port, portProps] = defineField('options.port', vuetifyConfig);
const [username, usernameProps] = defineField('options.username', vuetifyConfig);
const [password, passwordProps] = defineField('options.password', vuetifyConfig);
const [key, keyProps] = defineField('options.key', vuetifyConfig);
const [copyToServer, copyToServerProps] = defineField('copyToServer', vuetifyConfig);

const onSubmit = handleSubmit(async () => {
    key.value === 'new' ? key.value = newKeyName.value : key.value = key.value
    await settingStore.addServer(values as NewServer)
    localStorage.removeItem('createServerForm')
    handleReset()
    emit('close')
})

// const submit = async () => {
//     testForm.value.keyname === 'new' ? testForm.value.keyname = newKeyName.value : testForm.value.keyname = testForm.value.keyname
//     // console.log(testForm.value)
//     await settingStore.addServer(testForm.value)
//     testForm.value = { name: '', options: { protocol: 'local' } } as NewServer
//     emit('close')
// }

onMounted(async () => {
    await settingStore.fetchKeys()
    if (storedForm) {
        setValues(JSON.parse(storedForm))
    }
})

onBeforeUnmount(() => {
    localStorage.setItem('createServerForm', JSON.stringify(values))
})
</script>