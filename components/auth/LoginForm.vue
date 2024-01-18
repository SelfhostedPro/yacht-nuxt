<template>
    <!-- <v-card-title v-if="setup" class="text-center"> first time setup </v-card-title>
    <v-card-text>
        <v-form fast-fail>
            <v-text-field @keyup.enter="submit" v-model="username" label="username" append-inner-icon="mdi-account-circle" />
            <v-text-field @keyup.enter="submit" v-model="password" label="password" type="password" append-inner-icon="mdi-shield-key" />
            <v-text-field @keyup.enter="submit" v-if="setup" v-model="confirm" label="confirm" type="password" append-inner-icon="mdi-shield-key" />
        </v-form>
        <v-spacer />
        <v-btn v-if="setup" @keyup.enter="submit" v-on:click="submit" block color="primary" elevation="4">
            setup
        </v-btn>
        <v-btn v-else v-on:click="submit" block color="primary" elevation="4">
            submit
        </v-btn>
    </v-card-text> -->
</template>

<script setup lang="ts">
const username = ref("")
const password = ref("")
const confirm = ref("")

const props = defineProps(['setup'])

const submit = async () => {
    // if (props.registration){
    //     authStore.userRegister({username: username.value, password: password.value, admin: true})
    // } else {
    //     authStore.userLogin({username: username.value, password: password.value})
    // }
}

</script>