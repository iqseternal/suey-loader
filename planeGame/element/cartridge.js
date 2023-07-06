import { globalSetting } from '../init';
/**
 * 子弹
 */
export class Cartridge {
    x;
    y;
    moveX;
    moveY;
    deg;
    hitHarm;
    color;
    movePower;
    criticalBlow;
    isDied = false;
    constructor(x, y, moveX, moveY, // 方向上的移动
    deg, // 子弹偏移角度，仅用于绘制(弧度)
    hitHarm, // 子弹伤害
    color, // 子弹样式
    movePower, // 子弹自动速度倍率
    criticalBlow) {
        this.x = x;
        this.y = y;
        this.moveX = moveX;
        this.moveY = moveY;
        this.deg = deg;
        this.hitHarm = hitHarm;
        this.color = color;
        this.movePower = movePower;
        this.criticalBlow = criticalBlow;
    }
    draw() {
        const renderer = globalSetting.renderer;
        renderer.context2d.save();
        renderer.context2d.beginPath();
        renderer.context2d.translate(this.x, this.y);
        // console.log('发射角', radToAngle(this.deg));
        renderer.context2d.rotate(Math.PI / 2 + this.deg);
        renderer.context2d.drawImage(this.color, -globalSetting.cartridgeSize / 2, -globalSetting.cartridgeSize / 2, globalSetting.cartridgeSize, globalSetting.cartridgeSize);
        renderer.context2d.closePath();
        renderer.context2d.restore();
        // renderer.context2d.beginPath();
        // renderer.context2d.moveTo(
        //   this.x - globalSetting.cartridgeSize * 2,
        //   this.y
        // )
        // renderer.context2d.lineTo(
        //   this.x + globalSetting.cartridgeSize * 2,
        //   this.y
        // )
        // renderer.context2d.moveTo(
        //   this.x,
        //   this.y - globalSetting.cartridgeSize * 2
        // )
        // renderer.context2d.lineTo(
        //   this.x,
        //   this.y + globalSetting.cartridgeSize * 2
        // )
        // renderer.context2d.strokeStyle = '#fff';
        // renderer.context2d.stroke();
        // renderer.context2d.closePath();
    }
    update(base) {
        if (this.isDied)
            return [-1, -1];
        if (base) {
            this.x += this.moveX * base;
            this.y += this.moveY * base;
        }
        else {
            this.x += this.moveX;
            this.y += this.moveY;
        }
        if (this.x < 0 || this.x > globalSetting.renderer.width)
            this.isDied = true;
        if (this.y < 0 || this.y > globalSetting.renderer.height)
            this.isDied = true;
        if (!base)
            this.draw();
        return [this.x, this.y];
    }
}
//# sourceMappingURL=cartridge.js.map