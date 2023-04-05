
import { Plane, Weapon } from "./core";
import { Renderer } from "./renderer";

import { purplePlaneImg, yellowPlaneImg, shoot1Img, shoot2Img } from './asset';

import { makeCharKey, makeArrowKey, makeNumpadKey } from './keycode';

export type GlobalSetting = {
  planeSize: number; // 飞机大小

  cartridgeSize: number; // 子弹大小

  respond: number;  // 键盘响应速度

  hpMarginTop: number;  // 血条的 margin 值

  hpMarginLeft: number;

  hitHarm: number; // 子弹的默认伤害

  endImgWidth: number; // gameover 图片的默认大小

  renderer: Renderer; // 使用的 Renderer 渲染器

  [key: string]: number | Renderer | void;
};

const defaultSetting: Required<GlobalSetting> = {
  planeSize: 50, cartridgeSize: 20,

  respond: 20,

  hpMarginTop: 40, hpMarginLeft: 100,

  hitHarm: 50,

  endImgWidth: 800,

  renderer: void 0 as unknown as Renderer
};

/**
 * 采用立即执行函数导出，那么每一次导出的都是此模块下的对象
 * 并不是新的对象，所以此对象全局可修改变化
 */
export const globalSetting: GlobalSetting = (() => (defaultSetting))();

export type Init = ((renderer?: Renderer) => Plane[]) | ((renderer?: Renderer) => Promise<Plane[]>);

/**
 * 默认的初始化，参与作战的飞机以及键位的准备
 * @returns {Plane[]}
*/
export const defaultInitPlayer = (renderer?: Renderer) => {
  if (!renderer) return [];

  return [
    new Plane(
      200, 300, '#f00',
      purplePlaneImg, new Weapon(shoot2Img)
    ).registerEventListener(
      makeCharKey('w'), makeCharKey('s'),
      makeCharKey('a'), makeCharKey('d'),
      makeCharKey('j'), makeCharKey('k')
    ),
    new Plane(
      renderer.width - 200 - globalSetting.planeSize, 300, '#0f0',
      yellowPlaneImg, new Weapon(shoot1Img), // 飞机样式------装备的武器，以及武器子弹的样式
    ).registerEventListener(
      makeArrowKey('up'), makeArrowKey('down'),
      makeArrowKey('left'), makeArrowKey('right'),
      makeNumpadKey('1'), makeNumpadKey('2')
    )
  ]
}
