/**
 * 子弹
 */
export declare class Cartridge {
    x: number;
    y: number;
    private moveX;
    private moveY;
    private deg;
    hitHarm: number;
    private color;
    private movePower;
    criticalBlow: number;
    isDied: boolean;
    constructor(x: number, y: number, moveX: number, moveY: number, // 方向上的移动
    deg: number, // 子弹偏移角度，仅用于绘制(弧度)
    hitHarm: number, // 子弹伤害
    color: HTMLImageElement, // 子弹样式
    movePower: number, // 子弹自动速度倍率
    criticalBlow: number);
    draw(): void;
    update(base?: number): number[];
}
