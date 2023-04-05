export const isAreaKeyCode = (code: string, prefix: string): boolean =>
  new RegExp(prefix, 'g').test(code);

export const isCharArea = (code: string): boolean => isAreaKeyCode(code, 'Key');

export const isDigitArea = (code: string): boolean => isAreaKeyCode(code, 'Digit');

export const isNumpadArea = (code: string): boolean => isAreaKeyCode(code, 'Numpad');

export const isKeyCode = (code: string): boolean => {
  if (isCharArea(code)) {
    return (
      code[code.length - 1] >= 'a' && code[code.length - 1] <= 'z'
    ) || (
      code[code.length - 1] >= 'A' && code[code.length - 1] <= 'Z'
    )
  }

  if (isDigitArea(code) || isNumpadArea(code)) {
    return (
      code[code.length - 1] >= '0' && code[code.length - 1] <= '9'
    )
  }

  return false;
}

export type ControlKey = {
  code: string;
  key: string;
}

export const isKey = (e: KeyboardEvent, ctlKey: ControlKey): boolean => e.code === ctlKey.code;

export const makeCharKey = (key: string): ControlKey => ({ code: 'Key' + key.toLocaleUpperCase(), key: key.toLocaleUpperCase() });

export const makeDigitKey = (key: string): ControlKey => ({ code: 'Digit' + key, key });

export const makeNumpadKey = (key: string): ControlKey => ({ code: 'Numpad' + key, key });

export const makeArrowKey = (key: string): ControlKey => ({
  code: 'Arrow' + key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase(),
  key
});
