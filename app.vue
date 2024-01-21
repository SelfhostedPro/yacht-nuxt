<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
<style>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translate(300px, 0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translate(300px, 0);
}
</style>