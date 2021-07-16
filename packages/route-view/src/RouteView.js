import { createElement, Component } from 'react';
import callAsync from 'celia/es/callAsync';
import runQueue from 'celia/es/runQueue';
import parseQuery from 'fast-qs/es/parse';
import warn from 'celia/es/warn';
import isError from 'celia/es/isError';
import callHook from './callHook';

/**
 * 构造钩子函数需要的
 *
 * @param {object} propsFromRoute
 * @returns
 */
function enhanceRouteInfo(props) {
  const { name, propsFromRoute } = props;
  const { history, location, match, route = {} } = propsFromRoute;
  const { $from } = history;
  let { $to } = history;

  // 单独使用的情况下 history 没有 $to 属性
  if (!$to) {
    $to = {
      history
    };
    history.$to = $to;
  }

  $to.name = name || route.name || route.key;
  $to.location = location;
  $to.match = match;
  $to.meta = route.meta;
  if (!$to.query) {
    Object.defineProperty($to, 'query', {
      get() {
        let { _query } = this;
        if (!_query) {
          _query = parseQuery(this.location.search);
          this._query = _query;
        }
        return _query;
      }
    });
  }

  return { $to, $from };
}

/**
 * 用于控制 beforeHooks 调用完之后更新视图组件
 *
 * component
 * fallback
 * propsFromRoute
 * beforeHooks
 * afterHooks
 */
export default class RouteView extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // 需要更新时，不运行钩子队列
    if (!prevState.shouldUpdate) {
      const { onError } = nextProps;
      const { update } = prevState;
      const done = (ret) => {
        if (isError(ret)) {
          if (onError) {
            onError(ret);
            return;
          }
          warn(ret);
          return;
        }
        update();
      };
      callAsync(() => {
        const { $to, $from } = enhanceRouteInfo(nextProps);
        // 异步执行钩子队列
        runQueue(
          nextProps.beforeHooks,
          (hook, next) => {
            callHook(hook, $to, $from, next, done);
          },
          done
        );
      });
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      shouldUpdate: false,
      update: () => {
        this.setState({
          shouldUpdate: true
        });
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.shouldUpdate;
  }

  componentDidUpdate() {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.shouldUpdate = false;

    // 路由视图组件被加载后执行的钩子
    const { propsFromRoute, afterHooks } = this.props;
    const { $to, $from } = propsFromRoute.history;

    afterHooks.forEach((hook) => {
      hook($to, $from);
    });
  }

  componentDidMount() {
    this.mounted = true;
  }

  render() {
    const { props } = this;
    return this.mounted
      ? createElement(props.component, props.propsFromRoute)
      : props.fallback || null;
  }
}
