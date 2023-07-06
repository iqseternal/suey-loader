import { gameoverImg } from '../asset/asset';
import { globalSetting } from '../init';
import { purplePlaneImg, yellowPlaneImg, shoot1Img, shoot2Img } from '../asset';
import { Plane, Weapon } from '../element';
import { makeCharKey, makeArrowKey, makeNumpadKey } from '../base/keycode';
/**
 * 默认的初始化，参与作战的飞机以及键位的准备
 * @returns {Plane[]}
*/
export const defaultInitPlayer = (renderer) => {
    if (!renderer)
        return [];
    return [
        new Plane(200, 300, '#f00', purplePlaneImg, new Weapon(shoot2Img)).registerEventListener(makeCharKey('w'), makeCharKey('s'), makeCharKey('a'), makeCharKey('d'), makeCharKey('j'), makeCharKey('k')),
        new Plane(renderer.width - 200 - globalSetting.planeSize, 300, '#0f0', yellowPlaneImg, new Weapon(shoot1Img)).registerEventListener(makeArrowKey('up'), makeArrowKey('down'), makeArrowKey('left'), makeArrowKey('right'), makeNumpadKey('1'), makeNumpadKey('2'))
    ];
};
export class Gameover {
    winPlane;
    diedPlane;
    constructor(winPlane, diedPlane) {
        this.winPlane = winPlane;
        this.diedPlane = diedPlane;
    }
}
/**
 * 控制器
 */
export class Controller {
    renderer;
    planes = []; // 正在进行管理的飞机，在进行中加进来也是有效的
    diedPlane = [];
    overgameCbk = [];
    isStop = false;
    constructor(renderer) {
        this.renderer = renderer;
    }
    /**
     * 向控制器添加一台飞机，添加后 就会被控制器所管理
     * @param {Plane} plane
     */
    append(plane) {
        plane.xMax = this.renderer.width;
        plane.yMax = this.renderer.height;
        this.planes.forEach(planeItem => {
            planeItem.enemyPlane.push(plane);
            plane.enemyPlane.push(planeItem);
        });
        this.planes.push(plane);
    }
    appendGameoverCbk(fn) {
        this.overgameCbk.push(fn);
    }
    async start(init = defaultInitPlayer) {
        this.reset();
        const player = await init(this.renderer);
        player.forEach(player => this.append(player));
        this.run();
    }
    go() {
        this.isStop = false;
        this.planes.forEach(plane => {
            plane.isStop = false;
        });
        this.run();
    }
    stop() {
        this.isStop = true;
        this.planes.forEach(plane => {
            plane.isStop = true;
        });
    }
    /**
     * 重置
     */
    reset() {
        this.planes.forEach(plane => plane.distroy());
        this.planes = [];
        this.diedPlane.forEach(plane => plane.distroy());
        this.diedPlane = [];
        this.overgameCbk = [];
    }
    /**
     * 控制器的绘画，即 绘制 所有的飞机，飞机的子弹，武器，等等，都会由飞机自行管理
     */
    draw() {
        // 移动飞机，并移除死亡的飞机
        this.planes = this.planes.filter((plane, idx) => {
            // 传入planes长度的idx的原因为，飞机绘制时需要知道自己是第几架飞机
            // 用于绘制飞机的信息时使用
            plane.draw(this.planes.length, idx);
            // 如果飞机即将死亡
            if (plane.isBeforeDied) {
                plane.distroy();
                this.diedPlane.push(plane);
                return false;
            }
            return true;
        });
        // 如果只剩下了一架飞机，那么这个就是赢家
        // if (this.planes.length === 1) {
        //   throw new Gameover(
        //     this.planes[0],
        //     this.diedPlane
        //   )
        // }
    }
    /**
     *
     * 进行时
     */
    run() {
        const isStop = () => this.isStop;
        const clear = () => this.renderer.clear();
        const draw = () => this.draw();
        const gameover = () => this.gameover();
        const overgameCbk = () => this.overgameCbk;
        let keyFrames;
        (function run() {
            if (isStop()) {
                keyFrames && cancelAnimationFrame(keyFrames);
                return;
            }
            keyFrames = requestAnimationFrame(run);
            // 清空画布
            clear();
            // 使用控制器进行控制渲染页面
            try {
                draw();
            }
            catch (e) {
                cancelAnimationFrame(keyFrames);
                keyFrames = void 0;
                gameover();
                if (e instanceof Gameover) {
                    overgameCbk().forEach(cbk => cbk(e));
                    return;
                }
                console.warn('内部执行错误');
            }
        })();
    }
    /**
     * 绘制 Gameover
     */
    gameover() {
        const renderer = this.renderer;
        const ctx = renderer.context2d;
        const w = globalSetting.endImgWidth, h = w / 2;
        ctx.drawImage(gameoverImg, renderer.width / 2 - w / 2, renderer.height / 2 - h / 2, w, h);
        ctx.beginPath();
        ctx.font = '50px 微软雅黑';
        ctx.fillStyle = '#fff';
        ctx.fillText('Press the r key to restart the game.', renderer.width / 2 - w / 2, renderer.height - h / 2);
        ctx.closePath();
    }
}
//# sourceMappingURL=controller.js.map