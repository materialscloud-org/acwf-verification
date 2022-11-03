import React from "react";

import EOSGraph from "./EOSGraph";

import HeatMap from "./HeatMap";

// from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
const colorList = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#b15928",
  "#ffff99",
];

// Unified graph consisting of the EOS plot and the heatmap
// Specific to one single crystal

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
        color: colorList[i % colorList.length],
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
