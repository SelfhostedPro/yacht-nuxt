export interface SelectableItem {
    value: any;
    selectable: boolean;
}
interface GroupableItem<T = any> {
    type: 'item';
    raw: T;
}

export interface DataIteratorItem<T = any> extends GroupableItem<T>, SelectableItem {
    value: unknown;
}