import { REACT_APP_SALES_MODULE_PORT } from '@env';
import { Layout, Row } from 'antd';
import 'antd/dist/antd.css';
import { createBrowserHistory } from 'history';
import React, { createContext, useState } from 'react';
import { Router, Switch } from 'react-router-dom';
import Routes from '../src/Routes/';
import './App.scss';
import triarkLogo from './Assets/triarc-logo.png';
import profile from './Assets/profile.png';
import logoutImg from './Assets/logout.png';
import IdleTimer from 'react-idle-timer';
import { Modal, Button } from 'antd';
import { releaseLock } from './Redux/Services/dashboard';
import { releaseLockTwin2 } from './Redux/Services/dashboardTwin2';

const history = createBrowserHistory();
const { Header, Content, Footer } = Layout;
const CaseContext = createContext();

function App(props) {
  const IdleTimerRef = React.useRef(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const onIdle = () => {
    setIsModalVisible(true);
  };
  const handleLogout = () => {
    unlockCase();
    unlockCaseTwin2();
    localStorage.removeItem('token');
    // window.location.href = `${REDIRECT_URL}?search=${response.data.token}`;
    const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
    const REDIRECT_URL = `${FrontendURL}:${REACT_APP_SALES_MODULE_PORT}`;
    window.location.href = `${REDIRECT_URL}?clear=true`;
  };

  const [heading, setHeading] = useState('');

  const unlockCase = async () => {
    // const response = await
    const response = await releaseLock({
      applicantUniqueId: localStorage.getItem('appId')?.toString(),
      employeeId: localStorage.getItem('empId'),
    });

    if (!response?.error) {
      localStorage.removeItem('appId');
    }
  };

  const unlockCaseTwin2 = async () => {
    if (localStorage.getItem('applicantId')) {
      const response = await releaseLockTwin2({
        gupshupId: localStorage.getItem('applicantId')?.toString(),
        employeeId: localStorage.getItem('empId'),
      });

      if (!response?.error) {
        localStorage.removeItem('applicantId');
      }
    }
    // const response = await
  };

  const unlockCaseLogout = async () => {
    // const response = await
    if (localStorage.getItem('appId')) {
      const response = await releaseLock({
        applicantUniqueId: localStorage.getItem('appId')?.toString(),
        employeeId: localStorage.getItem('empId'),
      });

      if (!response?.error) {
        localStorage.removeItem('appId');
        const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
        const REDIRECT_URL = `${FrontendURL}:${REACT_APP_SALES_MODULE_PORT}`;
        window.location.href = `${REDIRECT_URL}?clear=true`;
      }
    } else if (localStorage.getItem('applicantId')) {
      const response = await releaseLockTwin2({
        gupshupId: localStorage.getItem('applicantId')?.toString(),
        employeeId: localStorage.getItem('empId'),
      });

      if (!response?.error) {
        localStorage.removeItem('applicantId');
        const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
        const REDIRECT_URL = `${FrontendURL}:${REACT_APP_SALES_MODULE_PORT}`;
        window.location.href = `${REDIRECT_URL}?clear=true`;
      }
    } else {
      localStorage.clear();
      const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
      const REDIRECT_URL = `${FrontendURL}:${REACT_APP_SALES_MODULE_PORT}`;
      window.location.href = `${REDIRECT_URL}?clear=true`;
    }
  };
  return (
    <Layout>
      <Header>
        <Row className={'headerRow'}>
          <img
            alt='logo'
            src={triarkLogo}
            className='cursorPointer'
            onClick={(e) => history.push('/disbursement/dashboard')}
            style={{ cursor: 'pointer' }}
          />
          <div className={'title'}>{`${heading}`}</div>
          {/* <img alt='logout' src={profile} onClick={unlockCaseLogout} /> */}
          <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              style={{ marginRight: 20 }}
              alt='logout'
              src={logoutImg}
              onClick={unlockCaseLogout}
            />
            {hovered && (
              <div
                style={{
                  marginRight: 40,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '80%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#E00000',
                  color: '#fff',
                  fontSize: '14px',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={unlockCaseLogout}
              >
                Logout
              </div>
            )}
          </div>
        </Row>
      </Header>
      <CaseContext.Provider value={{ setHeading, unlockCaseTwin2, unlockCase }}>
        <Content>
          <Modal
            visible={isModalVisible}
            onOk={() => {
              unlockCaseLogout();
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
            zIndex={1000}
            closable={false}
            cancelButtonProps={{
              style: {
                display: 'none',
              },
            }}
          >
            <p>Session Expired! Please re-login.</p>
          </Modal>
          <div className={'bodyWrapper'}>
            <div className={'bodyContainer'}>
              <IdleTimer ref={IdleTimerRef} timeout={900000} onIdle={onIdle}>
                <Router history={history}>
                  <Switch>
                    <Routes />
                  </Switch>
                </Router>
              </IdleTimer>
            </div>
          </div>
        </Content>
      </CaseContext.Provider>
    </Layout>
  );
}
export default { App, CaseContext };
