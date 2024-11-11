export interface ProgressDict {
    [id: string]: Progress
}
export interface Progress {
    id: string,
    title: string,
    bytes?: boolean;
    items: ProgressItems
}
export interface ProgressItems {
    [title: string]: ProgressItem
}



export interface ProgressTitleUpdate {
    id: string,
    title: string,
}
export interface ProgressUpdate {
    id: string,
    title?: string,
    item: ProgressItem
}
export interface ProgressItem {
    id: string;
    status: string;
    message?: string;
    current?: number;
    total?: number;
}