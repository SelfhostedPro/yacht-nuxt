export interface Notification {
    level: 'error' | 'warn' | 'debug' | 'info' | 'success',
    message: string,
    title?: string,
    from?: string,
    timeout?: number
    dedupe?: boolean
    vertical?: boolean
}

export interface NotificationEvent extends MessageEvent {
    data: Notification
}