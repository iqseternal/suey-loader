const defaultSetting = {
    canvasWidth: document.body.clientWidth,
    canvasHeight: document.body.clientHeight,
    planeSize: 50, cartridgeSize: 20,
    respond: 20,
    hpMarginTop: 40, hpMarginLeft: 100,
    hitHarm: 50,
    endImgWidth: 800,
    renderer: void 0
};
/**
 * 采用立即执行函数导出，那么每一次导出的都是此模块下的对象
 * 并不是新的对象，所以此对象全局可修改变化
 */
export const globalSetting = (() => (defaultSetting))();
//# sourceMappingURL=init.js.map