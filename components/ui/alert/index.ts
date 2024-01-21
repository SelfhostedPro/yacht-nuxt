import { cva } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertTitle } from './AlertTitle.vue'
export { default as AlertDescription } from './AlertDescription.vue'

export const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        success: 'bg-primary text-on-primary',
        info: 'bg-secondary text-on-secondary',
        warning: 'bg-tertiary text-on-tertiary',
        error: 'bg-error text-on-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
