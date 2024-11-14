import { defineNuxtModule } from "@nuxt/kit"

export default defineNuxtModule({
  setup(_options, nuxt) {
    for (const layer of nuxt.options._layers) {
      // You can check for a custom directory existence to extend for each layer
      console.log('Layer:', layer.cwd, layer.config)
    }
  }
})