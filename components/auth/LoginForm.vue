<template>
  <v-card-title
    v-if="setup"
    class="text-center"
  >
    first time setup
  </v-card-title>
  <v-card-text>
    <v-form fast-fail>
      <v-text-field
        v-model="username"
        label="username"
        append-inner-icon="mdi-account-circle"
        @keyup.enter="submit"
      />
      <v-text-field
        v-model="password"
        label="password"
        type="password"
        append-inner-icon="mdi-shield-key"
        @keyup.enter="submit"
      />
      <v-text-field
        v-if="setup"
        v-model="confirm"
        label="confirm"
        type="password"
        append-inner-icon="mdi-shield-key"
        @keyup.enter="submit"
      />
    </v-form>
    <v-spacer />
    <v-btn
      v-if="setup"
      block
      color="primary"
      elevation="4"
      @keyup.enter="submit"
      @click="submit"
    >
      setup
    </v-btn>
    <v-btn
      v-else
      block
      color="primary"
      elevation="4"
      @click="submit"
    >
      submit
    </v-btn>
  </v-card-text>
</template>

<script setup lang="ts">
const username = ref("")
const password = ref("")
const confirm = ref("")

defineProps<{ setup: boolean }>()

const submit = async () => {
    // if (props.registration){
    //     authStore.userRegister({username: username.value, password: password.value, admin: true})
    // } else {
    //     authStore.userLogin({username: username.value, password: password.value})
    // }
}

</script>