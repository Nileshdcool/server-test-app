import React from 'react';
import logo from '../Assets/square-logo.png';
import { Spin } from 'antd';

function Spinner(props) {
  return (
    <Spin
      spinning={props.spinning}
      indicator={<img alt='loading...' src={logo} />}
    >
      {props.children}
    </Spin>
  );
}

export default Spinner;
