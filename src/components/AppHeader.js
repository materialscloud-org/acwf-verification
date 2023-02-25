import React from "react";

import "./AppHeader.css";

export default function AppHeader() {
  return (
    <div className="title-and-logo">
      <span>AiiDA common workflows verification</span>
      <img src="./acwf-logo.png" className="acwf-logo"></img>
    </div>
  );
}
