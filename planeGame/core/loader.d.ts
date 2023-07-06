import { Renderer } from '../../core';
import { Controller } from './controller';
import { GlobalSetting } from '../init';
export type LoadResolve = {
    renderer: Renderer;
    controller: Controller;
};
/**
 * 加载器，资源的加载需要时间，这将是一个异步的函数
 * @param {string} canvas querySelector 选择器
 * @param {GlobalSetting} payload 全局配置
 * @returns {Promise<LoadResolve>}
 */
export declare const loader: (idSelector: string, payload?: Partial<GlobalSetting>) => Promise<LoadResolve>;
