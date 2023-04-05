## 安装

`npm config set registry https://registry.npmjs.org`

`npm install @suey/loader --save`



## 快速建立

```html
<style>
    * { margin: 0;padding: 0; }
    body { overflow: hidden; }
    #app { width: 100vw;height: 100vh; }
</style>

<div id="app"></div>
```

```javascript

import { loader } from '@suey/gameloader';

// 默认的玩家1 wasd 上下左右 j 攻击
// 默认的玩家2 ↑↓←→ 上下左右 小键盘1 攻击

// 加载挂载的元素 id
loader('app').then(async ({ controller }) => {
  controller.start(); // 立即开始游戏

  controller.appendGameoverCbk(message => {
    console.log(message.winPlane);
  }); // 添加一个游戏结束的回调


  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key.toLocaleLowerCase() === 'r') {
      controller.start(); // 当按下 r 键的时候重新开始
    }
  });

  window.addEventListener('keydown', e => {
    if (e.key.toLocaleLowerCase() === 'p') {
      controller.stop(); // 当按下 p 键的时候暂停游戏
    }
  });

  window.addEventListener('keydown', e => {
    if (e.key.toLocaleLowerCase() === 'o') {
      controller.go(); // 当按下 o 键的时候继续游戏
    }
  })
});
```



## 自定义元素

当默认的元素模型已经不能再满足你的需求的时候，你可以自定义飞机，子弹，按键等等

```javascript
import { loader } from '@suey/gameloader';

import type { Init } from '@suey/gameloader';
import {
  Plane, Weapon,
  assetLoader, makeCharKey, makeArrowKey, makeDigitKey, makeNumpadKey
} from '@suey/gameloader';

loader('app').then(async ({ controller }) => {
  // 创建 Init 函数 用户装载玩家飞机
  const init: Init = async () => {
    const playerOne = new Plane(
      100, 100, '#f00',
      await assetLoader('http://www.baidu.com/xxxxxx/xxxx.png'), // 使用 assetLoader 加载外部资源, 作为飞机的图片
      new Weapon(await assetLoader('http://www.baidu.com/xxxxx/xxx.png'), 3, 2, 2) // 创建飞机的武器, 子弹的图片, 子弹数量，子弹攻速，子弹飞行速度
    );

    playerOne.registerEventListener( // 为飞机添加按键
      makeCharKey('w'), makeCharKey('s'),
      makeCharKey('a'), makeCharKey('d'),
      makeCharKey('j'), makeCharKey('k')
    );

    const playerTwo = new Plane(
      100, 100, '#0f0',
      await assetLoader('http://www.baidu.com/xxxxxx/xxxx.png'),
      new Weapon(await assetLoader('http://www.baidu.com/xxxxx/xxx.png'), 1, 1, 1)
    );

    playerTwo.registerEventListener(
      makeArrowKey('up'), makeArrowKey('down'),
      makeArrowKey('left'), makeArrowKey('right'),
      makeNumpadKey('1'), makeNumpadKey('2')
    );

    return [playerOne, playerTwo];
  }

  controller.start(init); // 开始游戏
});
```















