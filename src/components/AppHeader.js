import React from "react";

import "./AppHeader.css";

import DoiBadge from "./DoiBadge";

export default function AppHeader() {
  return (
    <div className="title-and-logo">
      <div className="title-and-doi">
        <span className="title-span">AiiDA common workflows verification</span>
        <div style={{ marginLeft: "4px" }}>
          <DoiBadge />
        </div>
      </div>
      <img src="./acwf-logo.png" className="acwf-logo"></img>
    </div>
  );
}
