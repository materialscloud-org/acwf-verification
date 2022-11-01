import React from "react";

import EOSGraph from "./EOSGraph";

import HeatMap from "./HeatMap";

// Unified graph consisting of the EOS plot and the heatmap
// Specific to one single crystal

const colorList = ["green", "blue", "orange", "red", "black"];

class UnifiedGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("UnifiedGraph:", this.props.data);

    let inputData = {};

    for (const [i, code] of this.props.allCodes.entries()) {
      if (code == "ae") continue;
      if (!this.props.selectedCodes.has(code)) {
        continue;
      }
      inputData[code] = {
        color: colorList[i % 5],
        eos_data:
          this.props.data[code][this.props.type]["eos_data"][
            this.props.crystal
          ],
        bm_fit:
          this.props.data[code][this.props.type]["BM_fit_data"][
            this.props.crystal
          ],
      };
    }

    return (
      <div
        style={{
          border: "1px solid #999",
        }}
      >
        <center>
          <b>Compound: {this.props.crystal}</b>
        </center>
        <div
          style={{
            display: "flex",
            alignItems: "top",
            justifyContent: "space-evenly",
          }}
        >
          <div
            style={
              {
                // border: "1px solid #999",
              }
            }
          >
            <center>Equation of State curves</center>
            <EOSGraph inputData={inputData} />
          </div>
          <div
            style={
              {
                // border: "1px solid #999",
              }
            }
          >
            <center>Difference based on the selected measure</center>
            <HeatMap inputData={inputData} />
          </div>
        </div>
      </div>
    );
  }
}

export default UnifiedGraph;
