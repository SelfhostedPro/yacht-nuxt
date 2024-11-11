export interface Field {
    label: string;
    value: string;
    placeholder?: string;
    items?: string[] | boolean[];
    icons?: string[];
    cols?: number | string;
    validateOnMount?: boolean;
    multiple?: boolean;
    type: "VTextField" | "VSelect" | "VTextarea" | "VBtn" | "VBtnToggle" | "description" | "label";
}

export type Structure = Omit<Field, "value">