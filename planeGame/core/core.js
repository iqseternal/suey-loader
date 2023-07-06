export class DiedMessage {
    plane;
    cartridge;
    message;
    constructor(plane, // 死亡的飞机
    cartridge, // 导致飞机死亡的子弹
    message) {
        this.plane = plane;
        this.cartridge = cartridge;
        this.message = message;
    }
}
//# sourceMappingURL=core.js.map