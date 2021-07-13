import { createElement } from 'react';
import { Router as ReactRouter, Redirect, Route, Switch } from 'react-router';
import { createName, pathJoin, createHistoryBy } from 'celia';
import objectWithoutProperties from 'celia/es/objectWithoutProperties';

function createRoute(
  parentKey,
  parentPath,
  route,
) {
  let { key } = route;
  if (!key) {
    key = `${parentKey}.${createName()}`;
    route.key = key;
  }

  let { path } = route;
  if (!path) {
    throw new Error(`Missing path in named route ${name}`);
  }
  path = pathJoin(parentPath || '', path);

  const redirect = route.redirect || route.to;
  if (redirect) {
    return createElement(Redirect, {
      key,
      exact: true,
      from: path,
      to: redirect
    }); // 跳转路由
  }

  const routeConfig = objectWithoutProperties(route, [
    'to',
    'redirect',
    'component',
    'render',
    'children'
  ]);
  routeConfig.path = path;

  const { component, children, render } = route;

  routeConfig.render = function (cprops) {
    cprops.route = routeConfig;
    return render ? render(cprops) : createElement(component, cprops);
  };

  return !children || !children.length
    ? createElement(Route, routeConfig)
    : createElement(
      component,
      { key: `${key}-component`, route: routeConfig },
      createSwitch(key, path, children)
    ); // 如果有子路由，先创建对应的组件，再递归创建 Route
}

function createSwitch(parentKey, parentPath, routes) {
  return createElement(
    Switch,
    null,
    routes.map((route) => {
      return createRoute(
        parentKey,
        parentPath,
        route
      );
    })
  );
}

export function create({
  mode,
  routes
}) {
  const history = createHistoryBy(mode);

  return {
    history,

    Router() {
      return createElement(
        ReactRouter,
        { history, key: 'router' },
        createSwitch(
          'router',
          '',
          routes
        )
      );
    }
  };
}
