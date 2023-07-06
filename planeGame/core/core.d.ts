import { Plane, Cartridge } from '../element';
export declare class DiedMessage {
    plane: Plane;
    cartridge: Cartridge;
    message: string;
    constructor(plane: Plane, // 死亡的飞机
    cartridge: Cartridge, // 导致飞机死亡的子弹
    message: string);
}
