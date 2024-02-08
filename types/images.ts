export interface ImagePullProgress {
    status: string,
    progressDetail: {
        current: number | null,
        total: number | null,
    },
    progress: string,
    id: string
}