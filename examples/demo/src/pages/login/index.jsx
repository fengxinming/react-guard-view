import styles from './index.module.scss';
import React, { useState, useCallback } from 'react';
import { Input, Form, Message, Icon } from '@alicloud/console-components';
import { history } from '@/config/routes';

const FormItem = Form.Item;

function useMain() {
  const [state, setState] = useState({
    loading: false,
    errorMessage: '',
    value: {
      username: 'admin',
      password: ''
    }
  });

  const formChange = useCallback((formValue) => {
    setState((prev) => {
      return {
        ...prev,
        value: { ...prev.value, ...formValue }
      };
    });
  }, [setState]);

  const handleSubmit = useCallback((values, errors) => {
    if (errors) {
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, loading: false }));
      history.push({ name: 'guide' });
    }, 200);
  }, [setState]);

  return {
    state,
    formChange,
    handleSubmit
  };
}

function LoginForm() {
  const { state, formChange, handleSubmit } = useMain();
  const { value, errorMessage, loading } = state;

  console.info('render login');

  return (
    <h2 className={styles['login-frame']}>
      <div className={styles['login-box']}>
        <h3>管理员登录</h3>
        <div i-class={[styles['login-error'], { [styles.blank]: !errorMessage }]}>
          <Message i-if={errorMessage} type="warning">{errorMessage}</Message>
        </div>
        <Form value={value} onChange={formChange}>
          <FormItem className={styles.formItem}>
            <Input
              size="large"
              name="password"
              htmlType="password"
              placeholder="请输入管理员的密码"
              className={styles['login-input']}
            />
          </FormItem>
          <FormItem>
            <Form.Submit
              validate
              type="primary"
              htmlType="submit"
              loading={loading}
              onClick={handleSubmit}
              className={styles['login-submit']}
            >
              {loading ? '登录中...' : '登录'}
            </Form.Submit>
          </FormItem>
        </Form>
      </div>
    </h2>
  );
}

export default function () {

  return (
    <div className={styles['login-layout']}>
      <div className={styles.header}>
        <Icon type="Group1" size="medium" />
      </div>
      <div className={styles.aside}>
        <h2>欢迎访问</h2>
        <p>边缘一体机管理控制台</p>
      </div>
      <div className={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
}