import { Weapon } from './weapon';
import { Cartridge } from './cartridge';
import { ControlKey } from '../base/keycode';
/**
 * 飞机
 */
export declare class Plane {
    x: number;
    y: number;
    private hpColor;
    private planeColor;
    private weapon;
    private moveSpeed;
    private hp;
    enemyPlane: Plane[];
    cartridges: Cartridge[];
    isStop: boolean;
    private buff;
    private direction;
    private deg;
    isBeforeDied: boolean;
    isDied: boolean;
    private readonly movePixel;
    private readonly boundaryXMin;
    private readonly boundaryYMin;
    private boundaryXMax;
    set xMax(value: number);
    private boundaryYMax;
    set yMax(value: number);
    constructor(x: number, // 位置
    y: number, hpColor: string, // 血条样式, (颜色)
    planeColor: HTMLImageElement, // 飞机样式
    weapon: Weapon, // 武器
    moveSpeed?: number, // 飞机移动的速度
    hp?: number);
    /**
     * 一次射击
     */
    shoot(): void;
    /**
     * 发动技能！
     */
    skill(): void;
    /**
     * 飞机被某颗子弹击中了
     * @param {Cartridge} cartridge
     */
    beHit(cartridge: Cartridge): void;
    /**
     * 绘制此飞机
     * @param {number} num
     * @param {number} id 编号, 调用时传入，可以得到此飞机的编号，用于绘制飞机信息，例如 HP
     */
    draw(all: number, id: number): void;
    /**
     * 绘制信息，比如血条，等等
     */
    private drawMessage;
    /**
     * 绘制飞机元素
     */
    private drawPlane;
    private drawCartridge;
    moveTop(): void;
    moveDown(): void;
    moveLeft(): void;
    moveRight(): void;
    geometry(): number;
    private registerKeyDownEvt;
    private registerKeyUpEvt;
    /**
     * 依次传递键位
     * @param {ControlKey} top 上方向
     * @param {ControlKey} down 下方向
     * @param {ControlKey} left 左方向
     * @param {ControlKey} right 右方向
     * @param {ControlKey} hit 攻击
     * @param {ControlKey} skill 技能
     * @returns {this}
     */
    registerEventListener(top: ControlKey, down: ControlKey, left: ControlKey, right: ControlKey, hit: ControlKey, skill: ControlKey): Plane;
    distroy(): void;
}
