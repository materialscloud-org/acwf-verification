import React from "react";

import PTable from "./PTable";

import EOSGraph from "./EOSGraph";

import allData from "../data/dataFiles.js";

import Example from "./HeatMap";

import BarGraph from "./VisxExample";

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
      <div>
        <select
          name="dataset"
          id="dataset"
          onChange={this.datasetChange}
          value={this.state.value}
        >
          <option value="oxides-verification-PBE-v1">
            oxides-verification-PBE-v1
          </option>
          <option value="unaries-verification-PBE-v1">
            unaries-verification-PBE-v1
          </option>
        </select>
        <PTable />

        <div style={{ display: "flex" }}>
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
