export interface ImagePullProgress {
    status: string,
    progressDetail: {
        current: number,
        total: number,
    } | undefined,
    progress: string,
    id: string
}