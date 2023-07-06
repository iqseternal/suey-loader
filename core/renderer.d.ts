export declare class Renderer {
    readonly canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement, width?: number, height?: number);
    /**
     * 清空画布
     */
    clear(): void;
    get context2d(): CanvasRenderingContext2D;
    get width(): number;
    get height(): number;
}
export declare const randomRegion: (min: number, max: number) => number, getHexColor: () => string, getRgbaColor: (opacity?: number) => string, getDistance: (x1: number, y1: number, x2: number, y2: number) => number;
