// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
)
  .override('nuxt/vue/rules', {
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  })
