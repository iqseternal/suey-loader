import { Plane } from './plane';
export declare class StageProperty {
    x: number;
    y: number;
    private moveX;
    private moveY;
    constructor(x: number, y: number, moveX: number, moveY: number);
    draw(): void;
    update(): void;
    /**
     * 执行道具加成
     * @param {Plane} plane 受到加持的飞机
     */
    execute(plane: Plane): void;
}
/**
 * HP回复
 */
export declare class HpRecovery extends StageProperty {
    execute(plane: Plane): void;
}
/**
 * 武器攻击加持
 */
export declare class ForcePower extends StageProperty {
    execute(plane: Plane): void;
}
/**
 * 武器攻击速度加持
 */
export declare class ForceHitSpeed extends StageProperty {
    execute(plane: Plane): void;
}
/**
 * 武器发射子弹的移动速度加持
 */
export declare class ForceMoveSpeed extends StageProperty {
    execute(plane: Plane): void;
}
/**
 * 移动速度加持
 */
export declare class MovePower extends StageProperty {
    execute(plane: Plane): void;
}
