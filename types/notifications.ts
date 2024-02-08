import type { ImagePullProgress } from "./images"

export interface Notification {
    level: 'error' | 'warn' | 'debug' | 'info' | 'success',
    message: string,
    title?: string,
    from?: string,
    timeout?: number
    dedupe?: boolean
    vertical?: boolean
    progress?: ImagePullProgress
}

export interface NotificationWithProgress extends Notification {
    title: string
    progress: ImagePullProgress
}

export interface Progress {
    id: string,
    item: string,
    progress: ImagePullProgress
}
export interface ProgressInit extends Progress {
    title: string,
}

export interface NotificationEvent extends MessageEvent {
    data: Notification
}
