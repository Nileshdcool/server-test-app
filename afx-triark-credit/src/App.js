import { Layout, Row } from 'antd';
import 'antd/dist/antd.css';
import { createBrowserHistory } from 'history';
import React, { createContext, useState } from 'react';
import { Router, Switch } from 'react-router-dom';
import Routes from '../src/Routes/';
import './App.scss';
import triarclogo from './Assets/triarc-logo.png';
import IdleTimer from 'react-idle-timer';
import profile from './Assets/profile.png';
import logoutImg from './Assets/logout.png';
import { Modal, Button } from 'antd';
import { useStopwatch } from 'react-timer-hook';
import { releaseLock } from './Redux/Services/dashboard';

const history = createBrowserHistory();
const { Header, Content, Footer } = Layout;
const CaseContext = createContext();

const time = new Date();
time.setSeconds(time.getSeconds() + 1200); // 20 minutes timer

function App(props) {
  const IdleTimerRef = React.useRef(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const onIdle = () => {
    setIsModalVisible(true);
  };
  const [timerSeconds, setTimerSeconds] = React.useState('0');

  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false, offsetTimestamp: timerSeconds });

  const [heading, setHeading] = useState('');
  const [isTimerVisible, setIsTimerVisible] = useState(false);

  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  React.useEffect(() => {
    reset();
    pause();
  }, []);

  React?.useEffect(() => {
    if (window.location.href?.includes('/credit/dashboard')) {
      setIsTimerVisible(false);
    }
    if (window.location.href?.includes('/credit/dashboard')) {
      setIsTimerVisible(false);
    }
  }, [seconds]);

  //check for Navigation Timing API support
  window.onbeforeunload = function () {
    sessionStorage.setItem('timerSeconds', convertDurationtoSeconds());
    sessionStorage.setItem('is_reloaded', true);
  };

  window.onload = function () {
    if (window.location.href?.includes('/credit/dashboard')) {
      return true;
    } else {
      if (sessionStorage['is_reloaded']) {
        const sec = sessionStorage?.getItem('timerSeconds');
        const stopwatchOffset = new Date();
        stopwatchOffset.setSeconds(
          stopwatchOffset.getSeconds() + parseInt(sec)
        );
        setIsTimerVisible(true);
        reset(stopwatchOffset);
        sessionStorage.setItem('is_reloaded', false);
      }
    }
  };

  function convertDurationtoSeconds() {
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

  function setOffTimer(sec = 0) {
    const stopwatchOffset = new Date();
    stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + parseInt(sec));
    setIsTimerVisible(true);
    reset(stopwatchOffset);
  }

  const unlockAPI = async () => {
    pause();
    setIsTimerVisible(false);
    const response = await releaseLock({
      applicantUniqueId: localStorage.getItem('appId')?.toString(),
      employeeId: localStorage.getItem('empId'),
      lockReleaseTime: convertDurationtoSeconds(),
    });
    if (!response?.error) {
      localStorage.removeItem('appId');
      localStorage.removeItem('token');

      const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
      const REDIRECT_URL =
        process.env.REACT_APP_ENV == 'devlopment'
          ? `${FrontendURL}:5000`
          : `${FrontendURL}`;
      window.location.href = `${REDIRECT_URL}/log-in`;
    }
  };

  const handleLogout = async () => {
    if (window.location.href?.includes('/credit/dashboard')) {
      localStorage.clear();
      sessionStorage.clear();
      const FrontendURL = `${window.location.protocol}//${window.location.hostname}`;
      const REDIRECT_URL =
        process.env.REACT_APP_ENV == 'devlopment'
          ? `${FrontendURL}:5000`
          : `${FrontendURL}`;
      window.location.href = `${REDIRECT_URL}/log-in`;
    } else {
      unlockAPI();
    }
  };

  return (
    <Layout>
      <Header>
        <Row className={'headerRow'}>
          <img
            style={{ marginLeft: 20 }}
            alt='logo'
            src={triarclogo}
            onClick={(e) => history.push('/credit/dashboard')}
          />
          <div className={'title'}>{`${heading}`}</div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <>
              {isTimerVisible && (
                <div style={{ marginRight: 40 }}>
                  {hours > 0 ? (
                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      {hours} : {minutes} : {seconds}
                    </span>
                  ) : (
                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      {minutes} : {seconds}
                    </span>
                  )}
                </div>
              )}

              <div
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  style={{ marginRight: 20 }}
                  alt='logout'
                  src={logoutImg}
                  onClick={handleLogout}
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
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                )}
              </div>
            </>
          </div>
        </Row>
      </Header>
      <CaseContext.Provider
        value={{
          setHeading,
          setIsTimerVisible,
          start,
          reset,
          pause,
          convertDurationtoSeconds,
          setOffTimer,
          timerMins: `${minutes}.${seconds}`,
        }}
      >
        <Content>
          <Modal
            open={isModalVisible}
            onOk={() => {
              handleLogout();
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
