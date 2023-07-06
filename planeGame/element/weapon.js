import { Cartridge } from "./cartridge";
import { globalSetting } from "../init";
export const angleToRad = (angle) => angle * Math.PI / 180;
export const radToAngle = (rad) => rad * 180 / Math.PI;
export const sin = (rad) => {
    rad = Math.abs(rad) % Math.PI;
    if (rad === 0)
        return 0;
    return Math.sin(rad);
};
export const cos = (rad) => {
    rad = Math.abs(rad) % Math.PI;
    if (rad === 0)
        return 0;
    if (rad >= 0 && rad <= Math.PI / 2)
        return Math.cos(rad);
    return -1 * Math.cos(rad);
};
/**
 * 武器
 */
export class Weapon {
    cartridgeColor;
    fire;
    flightSpeed;
    moveSpeed;
    timer = null;
    constructor(cartridgeColor, // 子弹样式
    fire = 3, // 发射一次的子弹数量
    flightSpeed = 1, // 子弹的发射速度
    moveSpeed = 2 // 子弹的飞行速度, 初始为 1 即为默认状态，未收到增幅效果提升, 此单位为距离效果
    ) {
        this.cartridgeColor = cartridgeColor;
        this.fire = fire;
        this.flightSpeed = flightSpeed;
        this.moveSpeed = moveSpeed;
    }
    /**
     * 发射的子弹
     */
    hit(x, y, deg) {
        if (this.timer) {
            return [];
        }
        this.timer = 1; // 正在发射子弹，请等待
        const attackFan = Math.PI / 2; // 开火扇形角
        const fanAngle = attackFan / (this.fire + 1); // 开火间隔角
        const { abs } = Math;
        const cartridges = [];
        for (let i = 1; i * fanAngle < attackFan; i++) {
            // console.log(attackFan / 2);
            let fireAngle = deg - attackFan / 2 + i * fanAngle - Math.PI / 2;
            // 矫正大于了 180 后的角度， 约束其所有角度的绝对值都在[0-180]之间
            if (fireAngle > Math.PI)
                fireAngle = -1 * (Math.PI - fireAngle % Math.PI);
            const [fx, fy] = this.correct(fireAngle);
            const cosA = abs(cos(fireAngle) >= 0.0001 ? cos(fireAngle) : 1) * fx * this.moveSpeed;
            const sinA = abs(sin(fireAngle) >= 0.0001 ? sin(fireAngle) : 1) * fy * this.moveSpeed;
            const cartridge = new Cartridge(x, y, cosA, sinA, // !!!!!!
            fireAngle, globalSetting.hitHarm, this.cartridgeColor, 1, 0.2);
            // cartridge.update(30);
            cartridges.push(cartridge);
        }
        setTimeout(() => {
            this.timer = null;
        }, 1 / this.flightSpeed * 1000);
        return cartridges;
    }
    /**
     *
     * @param deg 弧度制
     * @returns {[number, number]} 用于矫正坐标
     */
    correct(deg) {
        deg = radToAngle(deg); // 角度矫正
        // fx, fy 坐标矫正
        const fx = ((deg >= -90 - 0.0001 && deg <= -90 + 0.0001) ||
            (deg >= 90 - 0.0001 && deg <= 90 + 0.0001)) ? 0 :
            ((deg > -90 && deg < 90)) ? 1 : -1;
        const fy = ((deg >= -180 - 0.0001 && deg <= -180 + 0.0001) ||
            (deg >= 180 - 0.0001 && deg <= 180 + 0.0001) ||
            (deg >= 0 - 0.0001 && deg <= 0 + 0.0001)) ? 0 :
            ((deg > 0 && deg < 90) || (deg >= 90 && deg < 180)) ? 1 : -1;
        return [fx, fy];
    }
}
//# sourceMappingURL=weapon.js.map