import React from "react";
import { useTimer } from "react-timer-hook";

function MyTimer({
  expiryTimestamp = 0,
  reset,
  setReset,
  stopTimer,
  setStopTimer,
}) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,

    onExpire: () => console.log("onExpire called"),
  });

  const time = () => {
    // Restarts to 5 minutes timer
  };

  React.useEffect(() => {
    setReset(false);
    const time = new Date();
    time.setSeconds(time.getSeconds() + 1200);
    restart(time);
  }, []);

  React.useEffect(() => {
    if (stopTimer) {
      pause();
      setStopTimer(false);
    }
  }, [stopTimer]);
  React.useEffect(() => {
    if (reset) {
      setReset(false);
      const time = new Date();
      time.setSeconds(time.getSeconds() + 1200);
      restart(time);
    }
  }, [reset]);

  const timerFunc = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          className={minutes < 1 ? "color-red" : ""}
          style={{ fontSize: "30px" }}
        >
          <span>{minutes}</span>:
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
      </div>
    );
  };

  return <>{timerFunc()}</>;
}

export default MyTimer;
