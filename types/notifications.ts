export interface NotificationEvent {
    level: 'error' | 'warn' | 'debug' | 'info' | 'success',
    message: string,
    title?: string,
    from?: string
}