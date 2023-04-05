export class Renderer {
  constructor(
    public readonly canvas: HTMLCanvasElement,
    width = document.body.clientWidth,
    height = document.body.clientHeight
  ) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * 清空画布
   */
  clear() {
    this.context2d.clearRect(0, 0, this.width, this.height);
  }

  get context2d(): CanvasRenderingContext2D {
    const context = this.canvas.getContext('2d');
    if (context) return context;
    throw '';
  }

  get width(): number { return this.canvas.width; }
  get height(): number { return this.canvas.height; }
}

export const [randomRegion, getHexColor, getRgbaColor, getDistance] = (() => {
  /**
   * 返回指定区间内的随机数值
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  const randomRegion = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

  // rgb 值可能出现的最大数字
  const maxNumber = 255;
  // 定义16进制可能出现的字符
  const hexColorChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  /**
   * 从 0-maxNumber 的闭区间中随机返回一个数字
   * @param {number} maxNumber
   * @returns {number}
   */
  const getDistNumber = (maxNumber: number) => Math.ceil(Math.random() * (maxNumber - 1));

  /**
   * 返回一个16进制中可能出现的字符
   * @returns {char}
   */
  const getHexColorChar = () => hexColorChar[getDistNumber(16) + 0];

  /**
   * 返回一个随机的16进制颜色
   * @returns {string}
   */
  const getHexColor = (): string => {
    let colorStr = '#';
    for (let i = 0;i < 6;i ++) colorStr += getHexColorChar();
    return colorStr;
  }

  /**
   * 返回 RGBA 值，如 rgba(0, 0, 0, 0.8)
   * @param {number} opacity 透明度，传递后可返回固定透明度的颜色RGB
   * @returns {string}
   */
  const getRgbaColor = (opacity?: number): string => {
    const r = getDistNumber(maxNumber);
    const g = getDistNumber(maxNumber);
    const b = getDistNumber(maxNumber);
    const a = Math.random() * 1;
    return `rgba(${r}, ${g}, ${b}, ${opacity ?? a})`;
  }

  /**
   * 得到两点间的距离
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns {number}
   */
  const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  return [
    randomRegion, getHexColor, getRgbaColor,

    getDistance
  ]
})();
