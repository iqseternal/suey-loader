import { globalSetting } from '../init';
import { getDistance } from '../../core/renderer';
import { isKey } from '../base/keycode';
import { bloodImg } from '../asset';
/**
 * 飞机
 */
export class Plane {
    x;
    y;
    hpColor;
    planeColor;
    weapon;
    moveSpeed;
    hp;
    enemyPlane = []; // 敌机，可以击中的飞机对象
    cartridges = []; // 飞机发射后的子弹, 由飞机管理他的飞行，但是发射是由飞机装备的武器进行发射
    isStop = false; // 是否被暂停了
    buff = {
        attack: 1,
        defense: 1,
        criticalBlow: 1,
        shootSpeed: 1,
        moveSpeed: 1, // 飞机移动速度增幅
    };
    direction = {
        top: false,
        down: false,
        left: false,
        right: false
    };
    deg = 0;
    isBeforeDied = false;
    isDied = false;
    movePixel = 5;
    boundaryXMin = 0;
    boundaryYMin = 0;
    boundaryXMax = 100;
    set xMax(value) { this.boundaryXMax = value; }
    boundaryYMax = 100;
    set yMax(value) { this.boundaryYMax = value; }
    constructor(x, // 位置
    y, hpColor, // 血条样式, (颜色)
    planeColor, // 飞机样式
    weapon, // 武器
    moveSpeed = 1, // 飞机移动的速度
    hp = 200 // 血条
    ) {
        this.x = x;
        this.y = y;
        this.hpColor = hpColor;
        this.planeColor = planeColor;
        this.weapon = weapon;
        this.moveSpeed = moveSpeed;
        this.hp = hp;
    }
    /**
     * 一次射击
     */
    shoot() {
        const cartridges = this.weapon.hit(this.x, this.y, this.deg);
        this.cartridges.push(...cartridges);
    }
    /**
     * 发动技能！
     */
    skill() {
    }
    /**
     * 飞机被某颗子弹击中了
     * @param {Cartridge} cartridge
     */
    beHit(cartridge) {
        if (this.hp > 0)
            this.hp -= cartridge.hitHarm;
        if (this.hp <= 0)
            this.isBeforeDied = true;
    }
    /**
     * 绘制此飞机
     * @param {number} num
     * @param {number} id 编号, 调用时传入，可以得到此飞机的编号，用于绘制飞机信息，例如 HP
     */
    draw(all, id) {
        this.drawPlane();
        this.drawCartridge();
        this.drawMessage(all, id);
    }
    /**
     * 绘制信息，比如血条，等等
     */
    drawMessage(all, id) {
        const renderer = globalSetting.renderer;
        const x = globalSetting.hpMarginLeft * (id + 1) + (id) * 200;
        const y = globalSetting.hpMarginTop;
        renderer.context2d.beginPath();
        renderer.context2d.moveTo(x, y);
        renderer.context2d.fillStyle = this.hpColor;
        renderer.context2d.fillRect(x + 30, y + 14, this.hp, 9);
        renderer.context2d.drawImage(bloodImg, x, y);
        renderer.context2d.closePath();
    }
    /**
     * 绘制飞机元素
     */
    drawPlane() {
        const renderer = globalSetting.renderer;
        renderer.context2d.save();
        renderer.context2d.beginPath();
        // 绘制此飞机
        renderer.context2d.translate(this.x, this.y);
        renderer.context2d.rotate(this.deg); // 弧度
        renderer.context2d.drawImage(this.planeColor, -globalSetting.planeSize / 2, -globalSetting.planeSize / 2, globalSetting.planeSize, globalSetting.planeSize);
        renderer.context2d.restore();
        // renderer.context2d.moveTo(
        //   this.x - globalSetting.planeSize * 2,
        //   this.y
        // )
        // renderer.context2d.lineTo(
        //   this.x + globalSetting.planeSize * 2,
        //   this.y
        // )
        // renderer.context2d.moveTo(
        //   this.x,
        //   this.y - globalSetting.planeSize * 2
        // )
        // renderer.context2d.lineTo(
        //   this.x,
        //   this.y + globalSetting.planeSize * 2
        // )
        // renderer.context2d.strokeStyle = '#fff';
        // renderer.context2d.stroke();
        renderer.context2d.closePath();
    }
    drawCartridge() {
        // 绘制此飞机发射的子弹
        // 如果击中了飞机，那么这颗子弹将会消失
        this.cartridges = this.cartridges.filter(cartridge => {
            const [x, y] = cartridge.update();
            if (cartridge.isDied)
                return false;
            let hitF = false; // hitF 表示是否击中
            this.enemyPlane = this.enemyPlane.filter(item => {
                if (hitF)
                    return true;
                const px = item.x, py = item.y;
                const distance = getDistance(x, y, px, py);
                if (distance <= 20) {
                    item.beHit(cartridge);
                    hitF = true; // 击中了
                    if (item.isBeforeDied) { // 击杀了战机
                        return false;
                    }
                }
                return true;
            });
            if (hitF)
                return false;
            return true;
        });
    }
    moveTop() {
        if (this.y - this.movePixel * this.moveSpeed < this.boundaryXMin) {
            this.y = this.boundaryYMin;
            return;
        }
        this.y -= this.movePixel * this.moveSpeed;
    }
    moveDown() {
        if (this.y + this.movePixel * this.moveSpeed > this.boundaryYMax) {
            this.y = this.boundaryYMax;
            return;
        }
        this.y += this.movePixel * this.moveSpeed;
    }
    moveLeft() {
        if (this.x - this.movePixel * this.moveSpeed < this.boundaryXMin) {
            this.x = this.boundaryXMin;
            return;
        }
        this.x -= this.movePixel * this.moveSpeed;
    }
    moveRight() {
        if (this.x + this.movePixel * this.moveSpeed > this.boundaryXMax) {
            this.x = this.boundaryXMax;
            return;
        }
        this.x += this.movePixel * this.moveSpeed;
    }
    geometry() {
        const angle = Math.PI / 4;
        let deg = 0;
        if (this.direction.top && !this.direction.down) {
            if (this.direction.left && !this.direction.right) {
                deg = angle * -1;
            }
            else if (this.direction.right && !this.direction.left) {
                deg = angle * 1;
            }
            else {
                deg = angle * 0;
            }
        }
        else if (this.direction.down && !this.direction.top) {
            if (this.direction.left && !this.direction.right) {
                deg = angle * 5;
            }
            else if (this.direction.right && !this.direction.left) {
                deg = angle * 3;
            }
            else {
                deg = angle * 4;
            }
        }
        else {
            // 左侧
            if (this.direction.left) {
                deg = angle * 6;
            }
            else {
                deg = angle * 2;
            }
        }
        return deg;
    }
    registerKeyDownEvt;
    registerKeyUpEvt;
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
    registerEventListener(top, down, left, right, hit, skill) {
        let str;
        let timerTop;
        let timerDown;
        let timerLeft;
        let timerRight;
        this.registerKeyDownEvt = (e) => {
            if (this.isStop)
                return;
            if (isKey(e, hit))
                this.shoot();
            if (isKey(e, skill))
                this.skill();
            if (isKey(e, top)) {
                if (timerTop)
                    return;
                timerTop = setInterval(() => {
                    this.direction.top = true;
                    this.deg = this.geometry();
                }, globalSetting.respond);
            }
            if (isKey(e, down)) {
                if (timerDown)
                    return;
                timerDown = setInterval(() => {
                    this.direction.down = true;
                    this.deg = this.geometry();
                }, globalSetting.respond);
            }
            if (isKey(e, left)) {
                if (timerLeft)
                    return;
                timerLeft = setInterval(() => {
                    this.direction.left = true;
                    this.deg = this.geometry();
                }, globalSetting.respond);
            }
            if (isKey(e, right)) {
                if (timerRight)
                    return;
                timerRight = setInterval(() => {
                    this.direction.right = true;
                    this.deg = this.geometry();
                }, globalSetting.respond);
            }
            if (!str) {
                str = setInterval(() => {
                    if (this.direction.top)
                        this.moveTop();
                    if (this.direction.down)
                        this.moveDown();
                    if (this.direction.right)
                        this.moveRight();
                    if (this.direction.left)
                        this.moveLeft();
                }, 100);
            }
        };
        this.registerKeyUpEvt = (e) => {
            if (this.isStop)
                return;
            if (isKey(e, top)) {
                this.direction.top = false;
                if (timerTop)
                    clearInterval(timerTop);
                timerTop = void 0;
            }
            if (isKey(e, down)) {
                this.direction.down = false;
                if (timerDown)
                    clearInterval(timerDown);
                timerDown = void 0;
            }
            if (isKey(e, left)) {
                this.direction.left = false;
                if (timerLeft)
                    clearInterval(timerLeft);
                timerLeft = void 0;
            }
            if (isKey(e, right)) {
                this.direction.right = false;
                if (timerRight)
                    clearInterval(timerRight);
                timerRight = void 0;
            }
            if (this.direction.top === false &&
                this.direction.down === false &&
                this.direction.left === false &&
                this.direction.right === false) {
                clearInterval(str);
                str = void 0;
            }
        };
        window.addEventListener('keydown', this.registerKeyDownEvt);
        window.addEventListener('keyup', this.registerKeyUpEvt);
        return this;
    }
    distroy() {
        if (this.registerKeyDownEvt)
            window.removeEventListener('keydown', this.registerKeyDownEvt);
        if (this.registerKeyUpEvt)
            window.removeEventListener('keyup', this.registerKeyUpEvt);
        this.registerKeyDownEvt = void 0;
        this.registerKeyUpEvt = void 0;
    }
}
//# sourceMappingURL=plane.js.map