# react-route-view

> A Higher-Order Route component with guard hooks.

## react-route-view 是什么

`react-route-view` 是具有守卫钩子的路由高阶组件。

## 路由初始化流程

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2021/png/269345/1626838881876-4c73b5a9-40cc-4e75-b8d3-b1a2938495a5.png) 

## 路由切换流程

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2021/png/269345/1626838917078-e4bef330-a8c8-4de0-852b-c75198dcdd2f.png) 

## 内部流程

![undefined](https://intranetproxy.alipay.com/skylark/lark/0/2021/png/269345/1626838974035-876380d3-709d-4d7a-b853-99651d47733b.png) 

## 导航流程

```txt
┌───────────────────────┐
│     push / replace    │
└──────────┬────────────┘
┌──────────┴────────────┐
│     匹配路由            │
└──────────┬────────────┘
┌──────────┴────────────┐
│     beforeEach        │
└──────────┬────────────┘
┌──────────┴────────────┐
│     beforeEnter       │
└──────────┬────────────┘
┌──────────┴────────────┐
│     渲染已匹配的组件     │
└──────────┬────────────┘
┌──────────┴────────────┐
│     afterEach         │
└──────────┬────────────┘
┌──────────┴────────────┐
│     afterEnter        │
└───────────────────────┘
```

## 安装

```bash
tnpm i react-route-view --save
```

## API

### create

配置参数定义：

```ts
import {Location, History, UnregisterCallback} from 'history';
import {match, RouteComponentProps} from 'react-router';

export interface IRouteInfo {
  name: string;
  location: Location;
  history: History;
  match: match;
  query: object;
  meta?: any;
}

export type Next = (done?: boolean) => void;
export type NextRedirect = (location?: string | Location) => void;
export type NextError = (err?: Error) => void;

export type BeforeEnter = (to: IRouteInfo, from: IRouteInfo, next: Next | NextError | NextRedirect) => void;
export type AfterEnter = (to: IRouteInfo, from: IRouteInfo) => void;

export type ConnectionRouteComponent = (route: RouteComponentProps) => React.ReactComponentElement;
export type ConnectionFn = (
  component: React.FC | React.Component, 
  config: {
    beforeEnter: BeforeEnter | BeforeEnter[],
    afterEnter: AfterEnter | AfterEnter[]
  }
) => ConnectionRouteComponent;

export interface ICreatedResult {
  connect: ConnectionFn;
  unlisten: (history: History) => UnregisterCallback;
}

export interface IRouteViewProps {
  onError: ErrorHandler;
  propsFromRoute: RouteComponentProps,
  component: React.Component,
  beforeHooks: BeforeEnter[],
  afterHooks: AfterEnter[]
}

export type ErrorHandler = (err: Error, props: IRouteViewProps) => void;

export function create(config: {
  onError: ErrorHandler;
  beforeEach: BeforeEnter | BeforeEnter[],
  afterEach: AfterEnter | AfterEnter[]
}): ICreatedResult;
```

创建一个具有守卫钩子的路由高阶组件，包含以下实例属性：

#### connect

返回一个高阶组件在路由匹配后会进入守卫钩子函数

```ts
type ConnectionRouteComponent = (route: RouteComponentProps) => React.ReactComponentElement;

connect(
  component: React.FC | React.Component, 
  config: {
    beforeEnter: BeforeEnter | BeforeEnter[],
    afterEnter: AfterEnter | AfterEnter[]
  }
) => ConnectionRouteComponent;
```

#### unlisten

移除对 history 的监听

### RouteView

配置参数定义：

```ts
import {RouteComponentProps} from 'react-router';
export interface IRouteViewProps {
  onError: ErrorHandler;
  propsFromRoute: RouteComponentProps,
  component: React.Component,
  beforeHooks: BeforeEnter[],
  afterHooks: AfterEnter[]
}

export type ErrorHandler = (err: Error, props: IRouteViewProps) => void;

export const RouteView: React.Component<IRouteViewProps, any>;
```

## 使用

