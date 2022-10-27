import React from "react";

import PTable from "./PTable";

import EOSGraph from "./EOSGraph";

import allData from "../data/dataFiles.js";

import Example from "./HeatMap";

import BarGraph from "./VisxExample";

import CodeSelector from "./CodeSelector";
import MeasureSelector from "./MeasureSelector";

import "./ACWF.css";

class ACWF extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datasetLabel: "oxides-verification-PBE-v1",
      selectedElement: "As",
    };

    this.datasetChange = this.datasetChange.bind(this);
  }

  datasetChange(event) {
    this.setState({ datasetLabel: event.target.value });
  }

  render() {
    var selectedData = allData[this.state.datasetLabel];

    return (
      <div style={{ border: "1px solid #999" }}>
        <PTable />
        <div className="selector_container">
          <CodeSelector />
          <MeasureSelector />
        </div>
        <div style={{ display: "flex", border: "1px solid #999" }}>
          <div>
            {Object.keys(selectedData).map((code, i) => (
              <EOSGraph
                key={i}
                eos_data={selectedData[code]["eos_data"]["Ag-X2O"]}
                bm_fit={selectedData[code]["BM_fit_data"]["Ag-X2O"]}
              />
            ))}
          </div>
          <div>
            <Example />
          </div>
        </div>
      </div>
    );
  }
}

export default ACWF;
