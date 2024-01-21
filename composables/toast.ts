import { type Notification } from '~/types/notifications'
import type { NotivueItem } from 'notivue'

const notifications = ref([] as Notification[])
const currentNotifications = ref([] as Notification[])

export const useToast = ({ title, message, level, from, timeout, dedupe, vertical, ...rest }: Notification) => {
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
        title: title || message,
        message: title ? message : '',
        duration: timeout || Number.POSITIVE_INFINITY,
        id: message,
        props: { ...rest },
        onAutoClear() {
            currentNotifications.value.splice(existing, 1)
            notifications.value.push({ title, message, level, from, timeout })
        },
        onManualClear() {
            currentNotifications.value.splice(existing, 1)
            notifications.value.push({ title, message, level, from, timeout })
        },
    }
    currentNotifications.value.push({ title, message, level, from, timeout })
    switch (level) {
        case 'success':
            push.success(toastOptions)
            break;
        case 'info':
            push.info(toastOptions)
            break;
        case 'warn':
            push.warning(toastOptions)
            break;
        case 'error':
            push.error(toastOptions)
            break;
        default:
            push.info(toastOptions)
            break;
    }
}
// import { toast } from 'vuetify-sonner'
// import { type Notification } from '~/types/notifications'



// export const useToast = ({ title, message, level, from, timeout, dedupe, vertical }: Notification) => {
//   const previous = notifications.value.find(n => n.message === message)
//   const existing = currentNotifications.value.findIndex(n => n.message === message)



//   const toastOptions = {
//     description: title ? message : undefined,
//     duration: timeout || Number.POSITIVE_INFINITY,
//     // vertical: vertical || false,
//     cardProps: {
//       color: level === 'debug' ? 'info' : level,
//       maxWidth: '70vw',
//     },
//     action: {
//       label: 'close',
//       onClick: () => {
//         toast.dismiss()
//         currentNotifications.value.splice(existing, 1)
//         notifications.value.push({ title, message, level, from, timeout })
//       },
//       onDismiss: () => {
//         currentNotifications.value.splice(existing, 1)
//         notifications.value.push({ title, message, level, from, timeout })
//       },
//       onAutoClose: () => {
//         currentNotifications.value.splice(existing, 1)
//         notifications.value.push({ title, message, level, from, timeout })
//       }
//     },
//   }
//   currentNotifications.value.push({ title, message, level, from, timeout })
//   switch (level) {
//     case 'success':
//       toast.success(title || message, toastOptions)
//       break;
//     case 'info':
//       toast.info(title || message, toastOptions)
//       break;
//     case 'warn':
//       toast.warning(title || message, toastOptions)
//       break;
//     case 'error':
//       toast.error(title || message, toastOptions)
//       break;
//     default:
//       toast(title || message, toastOptions)
//       break;
//   }
// }
