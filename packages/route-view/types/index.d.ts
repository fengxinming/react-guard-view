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

export type Next = (stop?: boolean) => void;
export type NextRedirect = (location: string | Location) => void;

export type BeforeEnter = (to: IRouteInfo, from: IRouteInfo, next: Next | NextRedirect) => void;
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
  propsFromRoute: RouteComponentProps,
  component: React.Component,
  beforeHooks: BeforeEnter[],
  afterHooks: AfterEnter[]
}

export function create(config: {
  beforeEach: BeforeEnter | BeforeEnter[],
  afterEach: AfterEnter | AfterEnter[]
}): ICreatedResult;

export const RouteView: React.Component<IRouteViewProps, any>;
