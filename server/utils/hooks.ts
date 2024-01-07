import { createHooks } from 'hookable'

export interface YachtHooks {
  'notification:event': (data: any) => any | void
}

export const YachtHooks = createHooks<YachtHooks>()