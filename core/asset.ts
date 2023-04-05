
import { bloodSrc, gameoverSrc, purplePlaneSrc, yellowPlaneSrc, cartridge1Src, cartridge2Src } from './base64';

/**
 * 返回 Image 资源, 异步
 * @param src
 */
export const resourceLoader = (src: string) => {
  const img = document.createElement('img');
  img.src = src;
  return img;
}

export const assetLoader = (src: string): Promise<HTMLImageElement> => {
  return new Promise(resolve => {
    const img = resourceLoader(src);

    img.onload = () => {
      resolve(img);
    }
  });
}

export const gameoverImg = resourceLoader(gameoverSrc);

export const bloodImg = resourceLoader(bloodSrc);

export const yellowPlaneImg = resourceLoader(yellowPlaneSrc);

export const purplePlaneImg = resourceLoader(purplePlaneSrc);

export const shoot1Img = resourceLoader(cartridge2Src);

export const shoot2Img = resourceLoader(cartridge1Src);

export const promiseAll = (() => {
  const planeAll = [gameoverImg, bloodImg, yellowPlaneImg, purplePlaneImg, shoot1Img, shoot2Img];

  const promiseAll: Promise<void>[] = [];

  planeAll.forEach(plane => {
    promiseAll.push(new Promise(resolve => {
      plane.onload = () => {
        resolve();
      }
    }))
  });

  return promiseAll;
})();



