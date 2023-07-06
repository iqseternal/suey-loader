import { globalSetting } from '../init';
import { getHexColor } from '../../core/renderer';
export class StageProperty {
    x;
    y;
    moveX;
    moveY;
    constructor(x, y, moveX, moveY) {
        this.x = x;
        this.y = y;
        this.moveX = moveX;
        this.moveY = moveY;
    }
    draw() {
        const renderer = globalSetting.renderer;
        renderer.context2d.beginPath();
        renderer.context2d.arc(this.x, this.y, 10, 0, Math.PI * 2);
        renderer.context2d.fillStyle = getHexColor();
        renderer.context2d.fill();
        renderer.context2d.closePath();
    }
    update() {
        this.x += this.moveX;
        this.y += this.moveY;
        this.draw();
    }
    /**
     * 执行道具加成
     * @param {Plane} plane 受到加持的飞机
     */
    execute(plane) {
    }
}
/**
 * HP回复
 */
export class HpRecovery extends StageProperty {
    execute(plane) {
    }
}
/**
 * 武器攻击加持
 */
export class ForcePower extends StageProperty {
    execute(plane) {
    }
}
/**
 * 武器攻击速度加持
 */
export class ForceHitSpeed extends StageProperty {
    execute(plane) {
    }
}
/**
 * 武器发射子弹的移动速度加持
 */
export class ForceMoveSpeed extends StageProperty {
    execute(plane) {
    }
}
/**
 * 移动速度加持
 */
export class MovePower extends StageProperty {
    execute(plane) {
    }
}
//# sourceMappingURL=buff.js.map