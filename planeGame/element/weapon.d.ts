import { Cartridge } from "./cartridge";
export declare const angleToRad: (angle: number) => number;
export declare const radToAngle: (rad: number) => number;
export declare const sin: (rad: number) => number;
export declare const cos: (rad: number) => number;
/**
 * 武器
 */
export declare class Weapon {
    private cartridgeColor;
    private fire;
    private flightSpeed;
    private moveSpeed;
    private timer;
    constructor(cartridgeColor: HTMLImageElement, // 子弹样式
    fire?: number, // 发射一次的子弹数量
    flightSpeed?: number, // 子弹的发射速度
    moveSpeed?: number);
    /**
     * 发射的子弹
     */
    hit(x: number, y: number, deg: number): Cartridge[];
    /**
     *
     * @param deg 弧度制
     * @returns {[number, number]} 用于矫正坐标
     */
    correct(deg: number): number[];
}
