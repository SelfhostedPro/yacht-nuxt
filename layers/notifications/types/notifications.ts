export type NotificationLevel = 'info' | 'warn' | 'error' | 'fatal' | 'success' | 'debug'
export interface Notification {
    title?: string,
    message: string,
    level?: NotificationLevel,
    timeout?: number,
    dedupe?: boolean
}
export interface NotificationWithID extends Notification {
    id: string | number
}