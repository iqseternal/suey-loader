import { getHexColor, getDistance } from "./renderer";

import { isKey } from './keycode';
import type { ControlKey } from './keycode';

import { bloodImg } from './asset';
import { globalSetting } from './init';

export const angleToRad = (angle: number): number => angle * Math.PI / 180;

export const radToAngle = (rad: number): number => rad * 180 / Math.PI;

export const sin = (rad: number): number => {
  rad = Math.abs(rad) % Math.PI;
  if (rad === 0) return 0;
  return Math.sin(rad);
}

export const cos = (rad: number): number => {
  rad = Math.abs(rad) % Math.PI;
  if (rad === 0) return 0;
  if (rad >= 0 && rad <= Math.PI / 2) return Math.cos(rad);
  return -1 * Math.cos(rad);
}

export class DiedMessage {
  constructor(
    public plane: Plane, // 死亡的飞机

    public cartridge: Cartridge, // 导致飞机死亡的子弹

    public message: string
  ) {}
}

export class StageProperty {
  constructor(
    public x: number,
    public y: number,
    private moveX: number,
    private moveY: number,
  ) {}

  draw() {
    const renderer = globalSetting.renderer;

    renderer.context2d.beginPath();

    renderer.context2d.arc(
      this.x,
      this.y,
      10,
      0,
      Math.PI * 2
    );

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
  execute(plane: Plane) {

  }
}

/**
 * HP回复
 */
export class HpRecovery extends StageProperty {
  execute(plane: Plane): void {

  }
}

/**
 * 武器攻击加持
 */
export class ForcePower extends StageProperty {
  execute(plane: Plane): void {

  }
}

/**
 * 武器攻击速度加持
 */
export class ForceHitSpeed extends StageProperty {
  execute(plane: Plane): void {

  }
}

/**
 * 武器发射子弹的移动速度加持
 */
export class ForceMoveSpeed extends StageProperty {
  execute(plane: Plane): void {

  }
}

/**
 * 移动速度加持
 */
export class MovePower extends StageProperty {
  execute(plane: Plane): void {

  }
}

/**
 * 子弹
 */
export class Cartridge {
  public isDied = false;

  constructor(
    public x: number,
    public y: number,
    private moveX: number,
    private moveY: number, // 方向上的移动
    private deg: number, // 子弹偏移角度，仅用于绘制(弧度)
    public hitHarm: number, // 子弹伤害
    private color: HTMLImageElement, // 子弹样式
    private movePower: number, // 子弹自动速度倍率
    public criticalBlow: number, // 暴击概率
  ) {}

  draw() {
    const renderer = globalSetting.renderer;
    renderer.context2d.save();
    renderer.context2d.beginPath();

    renderer.context2d.translate(this.x, this.y);

    // console.log('发射角', radToAngle(this.deg));
    renderer.context2d.rotate(Math.PI / 2 + this.deg);

    renderer.context2d.drawImage(
      this.color,
      -globalSetting.cartridgeSize / 2, -globalSetting.cartridgeSize / 2,
      globalSetting.cartridgeSize, globalSetting.cartridgeSize
    );
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

  update(base?: number): number[] {
    if (this.isDied) return [-1, -1];
    if (base) {
      this.x += this.moveX * base;
      this.y += this.moveY * base;
    }
    else {
      this.x += this.moveX;
      this.y += this.moveY;
    }

    if (this.x < 0 || this.x > globalSetting.renderer.width) this.isDied = true;
    if (this.y < 0 || this.y > globalSetting.renderer.height) this.isDied = true;

    if (!base) this.draw();

    return [this.x, this.y];
  }
}

/**
 * 武器
 */
export class Weapon {
  private timer: number | null = null;

  constructor(
    private cartridgeColor: HTMLImageElement, // 子弹样式
    private fire = 3, // 发射一次的子弹数量
    private flightSpeed = 1, // 子弹的发射速度
    private moveSpeed = 2 // 子弹的飞行速度, 初始为 1 即为默认状态，未收到增幅效果提升, 此单位为距离效果
  ) {}

  /**
   * 发射的子弹
   */
  hit(x: number, y: number, deg: number) {
    if (this.timer) {
      return [];
    }
    this.timer = 1; // 正在发射子弹，请等待

    const attackFan = Math.PI / 2; // 开火扇形角
    const fanAngle = attackFan / (this.fire + 1); // 开火间隔角

    const { abs } = Math;
    const cartridges: Cartridge[] = [];

    for (let i = 1;i * fanAngle < attackFan;i ++) {
      // console.log(attackFan / 2);
      let fireAngle = deg - attackFan / 2 + i * fanAngle - Math.PI / 2;
      // 矫正大于了 180 后的角度， 约束其所有角度的绝对值都在[0-180]之间
      if (fireAngle > Math.PI) fireAngle = -1 * (Math.PI - fireAngle % Math.PI);
      const [fx, fy] = this.correct(fireAngle);

      const cosA = abs(
        cos(fireAngle) >= 0.0001 ? cos(fireAngle) : 1
      ) * fx * this.moveSpeed;

      const sinA = abs(
        sin(fireAngle) >= 0.0001 ? sin(fireAngle) : 1
      ) * fy * this.moveSpeed;

      const cartridge = new Cartridge(
        x, y,
        cosA, sinA, // !!!!!!
        fireAngle,
        globalSetting.hitHarm,
        this.cartridgeColor,
        1,
        0.2
      );

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
  correct(deg: number) { // 由当前武器角度朝向，计算坐标位矫正
    deg = radToAngle(deg); // 角度矫正
    // fx, fy 坐标矫正
    const fx = (
      (deg >= -90 - 0.0001 && deg <= -90 + 0.0001) ||
      (deg >= 90 - 0.0001 && deg <= 90 + 0.0001)
    ) ? 0 :
      ((deg > -90 && deg < 90)) ? 1 : -1;

    const fy = (
      (deg >= -180 - 0.0001 && deg <= -180 + 0.0001) ||
      (deg >= 180 - 0.0001 && deg <= 180 + 0.0001) ||
      (deg >= 0 - 0.0001 && deg <= 0 + 0.0001)
    ) ? 0 :
      ((deg > 0 && deg < 90) || (deg >= 90 && deg < 180)) ? 1 : -1;

    return [fx, fy];
  }
}

/**
 * 飞机
 */
export class Plane {
  public enemyPlane: Plane[] = []; // 敌机，可以击中的飞机对象
  public cartridges: Cartridge[] = []; // 飞机发射后的子弹, 由飞机管理他的飞行，但是发射是由飞机装备的武器进行发射

  public isStop = false; // 是否被暂停了

  private buff = {
    attack: 1, // 攻击力增幅
    defense: 1, // 防御力增幅
    criticalBlow: 1, // 暴击概率增幅, 100%

    shootSpeed: 1, // 发射子弹增幅

    moveSpeed: 1, // 飞机移动速度增幅
  };
  private direction = {
    top: false,
    down: false,
    left: false,
    right: false
  };
  private deg: number = 0;

  public isBeforeDied = false;
  public isDied = false;

  private readonly movePixel = 5;
  private readonly boundaryXMin = 0;
  private readonly boundaryYMin = 0;
  private boundaryXMax = 100;
  set xMax(value: number) { this.boundaryXMax = value; }
  private boundaryYMax = 100;
  set yMax(value: number) { this.boundaryYMax = value; }

  constructor(
    public x: number, // 位置
    public y: number,

    private hpColor: string, // 血条样式, (颜色)
    private planeColor: HTMLImageElement, // 飞机样式
    private weapon: Weapon, // 武器

    private moveSpeed: number = 2, // 飞机移动的速度
    private hp: number = 200 // 血条
  ) {

  }

  /**
   * 一次射击
   */
  shoot() {
    const cartridges = this.weapon.hit(
      this.x,
      this.y,
      this.deg
    );

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
  beHit(cartridge: Cartridge) {
    if (this.hp > 0) this.hp -= cartridge.hitHarm;

    if (this.hp <= 0) this.isBeforeDied = true;
  }

  /**
   * 绘制此飞机
   * @param {number} num
   * @param {number} id 编号, 调用时传入，可以得到此飞机的编号，用于绘制飞机信息，例如 HP
   */
  draw(all: number, id: number) {
    this.drawPlane();
    this.drawCartridge();
    this.drawMessage(all, id);
  }

  /**
   * 绘制信息，比如血条，等等
   */
  private drawMessage(all: number, id: number) { // 从左上角开始绘制， id 为当前是第几个
    const renderer = globalSetting.renderer;
    const x = globalSetting.hpMarginLeft * (id + 1) + (id) * 200;
    const y = globalSetting.hpMarginTop;

    renderer.context2d.beginPath();
    renderer.context2d.moveTo(x, y);
    renderer.context2d.fillStyle = this.hpColor;

    renderer.context2d.fillRect(
      x + 30, y + 14,
      this.hp, 9
    );

    renderer.context2d.drawImage(bloodImg, x, y);
    renderer.context2d.closePath();
  }

  /**
   * 绘制飞机元素
   */
  private drawPlane() {
    const renderer = globalSetting.renderer;
    renderer.context2d.save();
    renderer.context2d.beginPath();

    // 绘制此飞机
    renderer.context2d.translate(this.x, this.y);
    renderer.context2d.rotate(this.deg); // 弧度

    renderer.context2d.drawImage(
      this.planeColor,
      -globalSetting.planeSize / 2,
      -globalSetting.planeSize / 2,
      globalSetting.planeSize,
      globalSetting.planeSize
    );

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

  private drawCartridge() {
    // 绘制此飞机发射的子弹
    // 如果击中了飞机，那么这颗子弹将会消失
    this.cartridges = this.cartridges.filter(cartridge => {
      const [x, y] = cartridge.update();
      if (cartridge.isDied) return false;

      let hitF = false; // hitF 表示是否击中

      this.enemyPlane = this.enemyPlane.filter(item => {
        if (hitF) return true;
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

      if (hitF) return false;
      return true;
    });
  }

  moveTop() {
    if (this.y - this.movePixel * this.moveSpeed < this.boundaryXMin) {
      this.y = this.boundaryYMin;
      return;
    }
    this.y -=  this.movePixel * this.moveSpeed;
  }

  moveDown() {
    if (this.y + this.movePixel * this.moveSpeed > this.boundaryYMax) {
      this.y = this.boundaryYMax;
      return;
    }
    this.y +=  this.movePixel * this.moveSpeed;
  }

  moveLeft() {
    if (this.x - this.movePixel * this.moveSpeed < this.boundaryXMin) {
      this.x = this.boundaryXMin;
      return;
    }
    this.x -=  this.movePixel * this.moveSpeed;
  }

  moveRight() {
    if (this.x + this.movePixel * this.moveSpeed > this.boundaryXMax) {
      this.x = this.boundaryXMax;
      return;
    }
    this.x +=  this.movePixel * this.moveSpeed;
  }

  geometry() { // 得到几何信息：弧度
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


  private registerKeyDownEvt: ((e: KeyboardEvent) => void) | undefined;
  private registerKeyUpEvt: ((e: KeyboardEvent) => void) | undefined;


  /**
   * 依次传递键位
   * @param {ControlKey} top 上方向
   * @param {ControlKey} down 下方向
   * @param {ControlKey} left 左方向
   * @param {ControlKey} right 右方向
   * @param {ControlKey} hit 攻击
   * @param {ControlKey} skill 技能
   * @returns {Plane}
   */
  registerEventListener(
    top: ControlKey,
    down: ControlKey,
    left: ControlKey,
    right: ControlKey,
    hit: ControlKey,
    skill: ControlKey
  ): Plane {
    let str: any;

    let timerTop: any;
    let timerDown: any;
    let timerLeft: any;
    let timerRight: any;

    this.registerKeyDownEvt = (e) => {
      if (this.isStop) return;

      if (isKey(e, hit)) this.shoot();
      if (isKey(e, skill)) this.skill();

      if (isKey(e, top)) {
        if (timerTop) return;
        timerTop = setInterval(() => {
          this.direction.top = true;
          this.deg = this.geometry();
        }, globalSetting.respond);
      }

      if (isKey(e, down)) {
        if (timerDown) return;
        timerDown = setInterval(() => {
          this.direction.down = true;
          this.deg = this.geometry();
        }, globalSetting.respond);
      }

      if (isKey(e, left)) {
        if (timerLeft) return;
        timerLeft = setInterval(() => {
          this.direction.left = true;
          this.deg = this.geometry();
        }, globalSetting.respond);
      }

      if (isKey(e, right)) {
        if (timerRight) return;
        timerRight = setInterval(() => {
          this.direction.right = true;
          this.deg = this.geometry();
        }, globalSetting.respond);
      }

      if (!str) {
        str = setInterval(() => {
          if (this.direction.top) this.moveTop();

          if (this.direction.down) this.moveDown();

          if (this.direction.right) this.moveRight();

          if (this.direction.left) this.moveLeft();
        }, 100);
      }
    }

    this.registerKeyUpEvt = (e) => {
      if (this.isStop) return;

      if (isKey(e, top)) {
        this.direction.top = false;
        if (timerTop) clearInterval(timerTop);
        timerTop = void 0;
      }

      if (isKey(e, down)) {
        this.direction.down = false;
        if (timerDown) clearInterval(timerDown);
        timerDown = void 0;

      }

      if (isKey(e, left)) {
        this.direction.left = false;
        if (timerLeft) clearInterval(timerLeft);
        timerLeft = void 0;
      }

      if (isKey(e, right)) {
        this.direction.right = false;
        if (timerRight) clearInterval(timerRight);
        timerRight = void 0;
      }

      if (
        this.direction.top === false &&
        this.direction.down === false &&
        this.direction.left === false &&
        this.direction.right === false
      ) {
        clearInterval(str);
        str = void 0;
      }
    }

    window.addEventListener('keydown', this.registerKeyDownEvt);
    window.addEventListener('keyup', this.registerKeyUpEvt);
    return this;
  }

  distroy() {
    if (this.registerKeyDownEvt) window.removeEventListener('keydown', this.registerKeyDownEvt);
    if (this.registerKeyUpEvt) window.removeEventListener('keyup', this.registerKeyUpEvt);

    this.registerKeyDownEvt = void 0;
    this.registerKeyUpEvt = void 0;
  }
}



