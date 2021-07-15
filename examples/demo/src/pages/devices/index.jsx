import React, { Component } from 'react';

export default class extends Component {
  componentDidMount() {
    console.info('componentDidMount 设备管理');
  }

  render() {
    console.info('render 设备管理');

    return (
      <h2>设备管理</h2>
    );
  }
}
