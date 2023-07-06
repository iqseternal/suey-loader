import { Renderer } from "../core/renderer";
export type GlobalSetting = {
    canvasWidth: number;
    canvasHeight: number;
    planeSize: number;
    cartridgeSize: number;
    respond: number;
    hpMarginTop: number;
    hpMarginLeft: number;
    hitHarm: number;
    endImgWidth: number;
    renderer: Renderer;
    [key: string]: number | Renderer | void;
};
/**
 * 采用立即执行函数导出，那么每一次导出的都是此模块下的对象
 * 并不是新的对象，所以此对象全局可修改变化
 */
export declare const globalSetting: GlobalSetting;
