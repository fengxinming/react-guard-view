import isError from 'celia/es/isError';

/**
 * 调用钩子函数
 *
 * @param {function} hook
 * @param {IRouteInfo} $to
 * @param {IRouteInfo} $from
 * @param {function} next
 * @param {function} done
 */
export default function callHook(hook, $to, $from, next, done) {
  hook($to, $from, (to) => {
    switch (to) {
      case undefined: // 调用下一个钩子
        return next();
      case true: // 完成 true
        return done(true);
      case false: // 完成 false
        return done(false);
    }

    switch (typeof to) {
      case 'string': // 重定向
        return $to.history.push(to);
      case 'object': // 重定向
        if (typeof to.pathname === 'string' || typeof to.name === 'string') {
          return $to.history[to.replace ? 'replace' : 'push'](to);
        }
        if (isError(to)) { // 完成
          return done(to);
        }
        // break omitted
      default: // 调用下一个钩子
        next();
    }
  }, done);
}
