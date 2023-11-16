import React from "react";
export const SpinnerLoader = () => {
  return <div class="loader"></div>;
};

export const FullScreenLoader = props => {
  return (
    <React.Fragment>
      {props && props.show && <div class="loading">Loading&#8230;</div>}
    </React.Fragment>
  );
};
