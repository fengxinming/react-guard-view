import { noop } from 'celia';

/**
 * 注册钩子函数
 *
 * @param {function[]} hooks
 * @param {function} fn
 * @returns
 */
export default function registerHook(hooks, fn) {
  if (typeof fn !== 'function') {
    return noop;
  }
  hooks.push(fn);
  return () => {
    const i = hooks.indexOf(fn);
    if (i > -1) {
      hooks.splice(i, 1);
    }
  };
}
