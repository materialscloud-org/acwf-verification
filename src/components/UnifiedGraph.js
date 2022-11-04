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

function isCharNum(c) {
  return c >= "0" && c <= "9";
}

function formatLabel(crystalLabel) {
  let sp = crystalLabel.split("-");
  console.log(sp);
  let formula = " " + sp[1].split("X").join(sp[0]);
  let jsx = [];
  for (var i = 0; i < formula.length; i++) {
    if (isCharNum(formula[i])) jsx.push(<sub key={i}>{formula[i]}</sub>);
    else jsx.push(formula[i]);
  }
  return (
    <b>
      Compound:
      {jsx}
    </b>
  );
}

// Unified graph consisting of the EOS plot and the heatmap
// Specific to one single crystal

class UnifiedGraph extends React.Component {
  constructor(props) {
    super(props);

    console.log(formatLabel("Ag-X2O"));
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
          borderRadius: "20px",
        }}
      >
        <center>{formatLabel(this.props.crystal)}</center>
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
            <HeatMap
              inputData={inputData}
              codeNameFormatting={this.props.codeNameFormatting}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UnifiedGraph;
