import { createElement } from 'react';
import RouteView from './RouteView';

/**
 * 用于创建连接函数
 *
 * @param {object} config
 * @returns
 */
export default function create({
  beforeEach,
  afterEach
} = {}) {
  let beforeHooks = [];
  let afterHooks = [];

  if (beforeEach) {
    beforeHooks = beforeHooks.concat(beforeEach);
  }
  if (afterEach) {
    afterHooks = afterHooks.concat(afterEach);
  }

  let unlisten;
  const listen = function (history) {
    if (!unlisten) {
      unlisten = history.listen(() => {
        history.$from = history.$to;
        history.$to = null;
      });
    }
  };

  return {
    unlisten() {
      unlisten && unlisten();
    },

    /**
     * 创建 RouteView
     *
     * @param {React.Component|React.FC} component
     * @param {object} config
     * @returns
     */
    connect(component, {
      name,
      beforeEnter,
      afterEnter
    } = {}) {
      beforeEnter = beforeEnter
        ? beforeHooks.concat(beforeEnter)
        : beforeHooks;

      afterEnter = afterEnter
        ? afterHooks.concat(afterEnter)
        : afterHooks;

      // 如果没有定义钩子函数，就直接渲染组件
      if (!beforeEnter.length && !afterEnter.length) {
        return function (propsFromRoute) {
          return createElement(component, propsFromRoute);
        };
      }

      return function (propsFromRoute) {
        listen(propsFromRoute.history);

        return createElement(RouteView, {
          name,
          propsFromRoute: propsFromRoute,
          component,
          beforeHooks: beforeEnter,
          afterHooks: afterEnter
        });
      };
    }
  };
}
