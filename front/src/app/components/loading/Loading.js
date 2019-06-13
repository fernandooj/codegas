import "./loading.scss";
import React from "react";
const Loading = ({ error }) => {
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <h3>{String(error)}</h3>
      </div>
    );
  } else {
    // console.log("styles", styles);
    return (
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube" />
        <div className="sk-cube2 sk-cube" />
        <div className="sk-cube4 sk-cube" />
        <div className="sk-cube3 sk-cube" />
      </div>
    );
  }
};
export default Loading;
