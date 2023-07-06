export declare const isAreaKeyCode: (code: string, prefix: string) => boolean;
export declare const isCharArea: (code: string) => boolean;
export declare const isDigitArea: (code: string) => boolean;
export declare const isNumpadArea: (code: string) => boolean;
export declare const isKeyCode: (code: string) => boolean;
export type ControlKey = {
    code: string;
    key: string;
};
export declare const isKey: (e: KeyboardEvent, ctlKey: ControlKey) => boolean;
export declare const makeCharKey: (key: string) => ControlKey;
export declare const makeDigitKey: (key: string) => ControlKey;
export declare const makeNumpadKey: (key: string) => ControlKey;
export declare const makeArrowKey: (key: string) => ControlKey;
