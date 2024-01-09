export interface Notification {
    level: 'error' | 'warn' | 'debug' | 'info' | 'success',
    message: string,
    title?: string,
    from?: string,
    timeout?: number
    dedupe?: boolean
}

export interface NotificationEvent extends MessageEvent {
    data: Notification
}