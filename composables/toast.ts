import { toast } from 'vuetify-sonner'
import { type Notification } from '~/types/notifications'

const notifications = ref([] as Notification[])
const currentNotifications = ref([] as Notification[])

export const useToast = async ({ title, message, level, from, timeout, dedupe }: Notification) => {
  const previous = notifications.value.find(n => n.message === message)
  const existing = currentNotifications.value.findIndex(n => n.message === message)

  if (previous && dedupe) {
    console.log(`supressing duplicate notification: ${level} - ${title} ${message}`)
    return
  } else if (existing > -1) {
    console.log(`supressing duplicate active notification: ${level} - ${title} ${message}`)
    return
  }

  const toastOptions = {
    description: title ? message : undefined,
    duration: timeout || Number.POSITIVE_INFINITY,
    // vertical: vertical || false,
    cardProps: {
      color: level === 'debug' ? 'info' : level,
      style: `white-space: pre-wrap;`,
      maxWidth: '70vw',
    },
    action: {
      label: 'close',
      onClick: () => {
        toast.dismiss()
        currentNotifications.value.splice(existing, 1)
        notifications.value.push({ title, message, level, from, timeout })
      },
      onDismiss: () => {
        currentNotifications.value.splice(existing, 1)
        notifications.value.push({ title, message, level, from, timeout })
      },
      onAutoClose: () => {
        currentNotifications.value.splice(existing, 1)
        notifications.value.push({ title, message, level, from, timeout })
      }
    },
  }
  currentNotifications.value.push({ title, message, level, from, timeout })
  switch (level) {
    case 'success':
      //@ts-expect-error lib types it wrong
      toast.success(title || message, toastOptions)
      break;
    case 'info':
      //@ts-expect-error lib types it wrong
      toast.info(title || message, toastOptions)
      break;
    case 'warn':
      //@ts-expect-error lib types it wrong
      toast.warning(title || message, toastOptions)
      break;
    case 'error':
      //@ts-expect-error lib types it wrong
      toast.error(title || message, toastOptions)
      break;
    default:
      //@ts-expect-error lib types it wrong
      toast(title || message, toastOptions)
      break;
  }
}
