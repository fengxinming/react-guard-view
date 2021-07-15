import create from 'route-view/es/create';
import BasicLayout from '../layouts/BasicLayout';
import Devices from '../pages/devices';
import Guide from '../pages/guide';
import Monitor from '../pages/monitor';
import System from '../pages/system';
import Tasks from '../pages/tasks';
import Login from '../pages/login';
import { create as createRouter } from '../common/router';

const { connect } = create({
  beforeEach(to, from, next) {
    console.info('beforeEach', 'to', to, 'from', from);
    if (to.name !== 'login') {
      if (!sessionStorage.getItem('token')) {
        return next('/login');
      }
    }
    else if (sessionStorage.getItem('token')) {
      return next('/');
    }
    next();
  }
});

const routes = [
  {
    name: 'login',
    path: '/login',
    exact: true,
    component: connect(Login)
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/',
        redirect: '/guide'
      },
      {
        path: '/guide',
        render: connect(Guide, {
          beforeEnter(to, from, next) {
            console.info('beforeEnter guide');
            next();
          }
        })
      },
      {
        path: '/devices',
        render: connect(Devices, {
          beforeEnter(to, from, next) {
            console.info('beforeEnter devices');
            next();
          }
        })
      },
      {
        path: '/tasks',
        render: connect(Tasks, {
          beforeEnter(to, from, next) {
            console.info('beforeEnter tasks');
            next('/guide');
          }
        })
      },
      {
        path: '/monitor',
        render: connect(Monitor, {
          beforeEnter(to, from, next) {
            console.info('beforeEnter monitor');
            next();
          }
        })
      },
      {
        path: '/system',
        render: connect(System, {
          beforeEnter(to, from, next) {
            console.info('beforeEnter system');
            next();
          }
        })
      }
    ]
  }
];

const { history, Router } = createRouter({
  mode: 'hash',
  routes
});

export { history, Router };
