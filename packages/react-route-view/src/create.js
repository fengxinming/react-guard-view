import { createElement } from 'react';
import RouteView from './RouteView';
import registerHook from './registerHook';

/**
 * 用于创建连接函数
 *
 * @param {object} config
 * @returns
 */
export default function create({
  onError
} = {}) {
  const beforeHooks = [];
  const afterHooks = [];
  const beforeRenders = [];
  let unlisten;
  const listen = function (propsFromRoute) {
    if (!unlisten) {
      const { history } = propsFromRoute;
      unlisten = history.listen(() => {
        history.$from = history.$to;
        history.$to = null;
      });
    }
    beforeRenders.forEach((fn) => {
      fn(propsFromRoute);
    });
  };

  return {
    unlisten() {
      unlisten && unlisten();
    },

    beforeRender(fn) {
      return registerHook(beforeRenders, fn);
    },

    beforeEach(fn) {
      return registerHook(beforeHooks, fn);
    },

    afterEach(fn) {
      return registerHook(afterHooks, fn);
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
      meta,
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
          beforeRenders.forEach((fn) => {
            fn(propsFromRoute);
          });
          return createElement(component, propsFromRoute);
        };
      }

      return function (propsFromRoute) {
        listen(propsFromRoute);

        return createElement(RouteView, {
          name,
          meta,
          onError,
          propsFromRoute,
          component,
          beforeHooks: beforeEnter,
          afterHooks: afterEnter
        });
      };
    }
  };
}
