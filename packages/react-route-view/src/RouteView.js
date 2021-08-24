import { createElement, Component } from 'react';
import { callAsync, runQueue, warn, isError } from 'celia';
import { parseQuery } from 'fast-qs';
import callHook from './callHook';

/**
 * 构造钩子函数需要的
 *
 * @param {object} props
 * @returns {object}
 */
function enhanceRouteInfo({ name, meta, propsFromRoute }) {
  const { history, location, match, route = {} } = propsFromRoute;
  let { $to } = history;

  // 单独使用的情况下 history 没有 $to 属性
  if (!$to) {
    $to = {
      history
    };
    history.$to = $to;
  }

  $to.name = name || route.name || route.key;
  $to.meta = meta || route.meta;
  $to.location = location;
  $to.match = match;

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

  return $to;
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

      callAsync(() => {
        const { onError } = nextProps;
        const { update } = prevState;

        // 钩子函数运行后执行
        const done = (ret) => {
          if (isError(ret)) {
            warn(ret);
            onError && onError(ret, nextProps);
            return;
          }
          update();
        };

        const { $from } = nextProps.propsFromRoute.history;
        const $to = enhanceRouteInfo(nextProps);

        // 异步执行钩子队列
        runQueue(
          nextProps.beforeHooks,
          (hook, next) => {
            callHook(hook, $to, $from, next, done);
          },
          done
        );
      }).catch((err) => {
        onError && onError(err, nextProps);
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
