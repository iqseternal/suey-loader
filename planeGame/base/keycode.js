export const isAreaKeyCode = (code, prefix) => new RegExp(prefix, 'g').test(code);
export const isCharArea = (code) => isAreaKeyCode(code, 'Key');
export const isDigitArea = (code) => isAreaKeyCode(code, 'Digit');
export const isNumpadArea = (code) => isAreaKeyCode(code, 'Numpad');
export const isKeyCode = (code) => {
    if (isCharArea(code)) {
        return (code[code.length - 1] >= 'a' && code[code.length - 1] <= 'z') || (code[code.length - 1] >= 'A' && code[code.length - 1] <= 'Z');
    }
    if (isDigitArea(code) || isNumpadArea(code)) {
        return (code[code.length - 1] >= '0' && code[code.length - 1] <= '9');
    }
    return false;
};
export const isKey = (e, ctlKey) => e.code === ctlKey.code;
export const makeCharKey = (key) => ({ code: 'Key' + key.toLocaleUpperCase(), key: key.toLocaleUpperCase() });
export const makeDigitKey = (key) => ({ code: 'Digit' + key, key });
export const makeNumpadKey = (key) => ({ code: 'Numpad' + key, key });
export const makeArrowKey = (key) => ({
    code: 'Arrow' + key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase(),
    key
});
//# sourceMappingURL=keycode.js.map