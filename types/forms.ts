export interface Field {
    label: string;
    value: string;
    placeholder?: string;
    items?: string[] | boolean[];
    icons?: string[];
    cols?: number | string;
    multiple?: boolean;
    type: "VTextField" | "VSelect" | "VTextarea" | "VBtn" | "VBtnToggle" | "description" | "label";
}

export interface Structure extends Omit<Field, "value"> {}