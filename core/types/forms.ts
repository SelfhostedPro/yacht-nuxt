export interface Field {
    label: string;
    value: string;
    placeholder?: string;
    name: string;
    items?: string[] | boolean[];
    icons?: string[];
    cols?: number | string;
    validateOnMount?: boolean;
    multiple?: boolean;
    type: "select" | "textarea" | "button" | "input" | "switch" | "description" | "label";
}

export type Structure = Omit<Field, "value">