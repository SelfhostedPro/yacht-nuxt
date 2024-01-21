import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-on-primary hover:bg-primary/90',
        destructive:
          'bg-error text-on-error hover:bg-error/90',
        outline:
          'border border-input bg-background hover:bg-tertiary hover:text-on-tertiary',
        secondary:
          'bg-secondary text-on-secondary hover:bg-secondary/80',
        ghost: 'hover:bg-secondary hover:text-on-secondary',
        link: 'text-primary underline-offset-4 hover:underline',
        circle: 'rounded-full bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        block: 'h-10 w-full',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
