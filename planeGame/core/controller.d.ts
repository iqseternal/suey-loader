import { Renderer } from '../../core/renderer';
import { Plane } from '../element';
export type Init = ((renderer?: Renderer) => Plane[]) | ((renderer?: Renderer) => Promise<Plane[]>);
/**
 * 默认的初始化，参与作战的飞机以及键位的准备
 * @returns {Plane[]}
*/
export declare const defaultInitPlayer: Init;
export declare class Gameover {
    readonly winPlane: Plane;
    readonly diedPlane: Plane[];
    constructor(winPlane: Plane, diedPlane: Plane[]);
}
export type GameoverCbk = (message: Gameover) => void;
/**
 * 控制器
 */
export declare class Controller {
    private readonly renderer;
    private planes;
    private diedPlane;
    private overgameCbk;
    private isStop;
    constructor(renderer: Renderer);
    /**
     * 向控制器添加一台飞机，添加后 就会被控制器所管理
     * @param {Plane} plane
     */
    append(plane: Plane): void;
    appendGameoverCbk(fn: GameoverCbk): void;
    start(init?: Init): Promise<void>;
    go(): void;
    stop(): void;
    /**
     * 重置
     */
    reset(): void;
    /**
     * 控制器的绘画，即 绘制 所有的飞机，飞机的子弹，武器，等等，都会由飞机自行管理
     */
    draw(): void;
    /**
     *
     * 进行时
     */
    private run;
    /**
     * 绘制 Gameover
     */
    private gameover;
}
