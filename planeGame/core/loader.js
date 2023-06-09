import { Renderer } from '../../core';
import { Controller } from './controller';
import { promiseAll } from '../asset/asset';
import { globalSetting } from '../init';
/**
 * 加载器，资源的加载需要时间，这将是一个异步的函数
 * @param {string} canvas querySelector 选择器
 * @param {GlobalSetting} payload 全局配置
 * @returns {Promise<LoadResolve>}
 */
export const loader = (idSelector, payload = {
    planeSize: 50,
    cartridgeSize: 20
}) => {
    const container = document.getElementById(idSelector);
    if (container === null) {
        throw `the container attribute is ${idSelector}, and document.getElementById is not HTMLElement. And you should give a dom element id.`;
    }
    // 处理全局对象的配置挂载, renderer 需要自行判定, 全局设置为了 undefined, 需确保它的存在
    while (container.firstChild)
        container.removeChild(container.firstChild);
    container.style.background = '#000';
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    payload = { ...globalSetting, ...payload };
    if (!payload.renderer)
        payload.renderer = new Renderer(canvas, payload.canvasWidth, payload.canvasHeight);
    for (const key in payload)
        globalSetting[key] = payload[key];
    // Canvas自定义对象，用于执行绘制
    const renderer = globalSetting.renderer;
    // Controller 整个游戏的控制器
    const controller = new Controller(renderer);
    // 使用 Promise 的原因为：Image 的加载需要事件，是异步的。
    // 所以在保证能够成功加载图片的前提下，才进行游戏
    return new Promise(resolve => {
        Promise.all(promiseAll).then(() => resolve({
            renderer,
            controller
        }));
    });
};
//# sourceMappingURL=loader.js.map