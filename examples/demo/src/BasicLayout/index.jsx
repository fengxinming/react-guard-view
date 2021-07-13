import styles from './index.module.scss';
import React from 'react';
import { Layout, SilderNav } from '@linkdesign/components';
import aside from '@/config/aside';
import logo from './logo.png';

const Panel = Layout.panel;

function BasicLayout({ children, location }) {
  aside.activeKey = location.pathname;

  return (
    <>
      <div className={styles.header}>
        <a href="#/">
          <img src={logo} alt="" />
        </a>
      </div>
      <div className={styles.body}>
        <SilderNav nav={aside} offsetHeight={50} />
        <Panel>
          {children}
        </Panel>
      </div>
    </>
  );
}

export default BasicLayout;
