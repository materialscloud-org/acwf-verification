import React from "react";

import EOSGraph from "./EOSGraph";

import HeatMap from "./HeatMap";

import {
  scaleEosPerFormulaUnit,
  scaleBMFitPerFormulaUnit,
} from "./DataUtilities";

function isCharNum(c) {
  return c >= "0" && c <= "9";
}

function formatLabel(crystalLabel) {
  let sp = crystalLabel.split("-");
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

class UnifiedGraph extends React.Component {
  // Unified graph consisting of the EOS plot and the heatmap
  // Specific to one single crystal
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        style={{
          border: "1px solid #999",
          borderRadius: "20px",
          width: "850px",
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
            <center style={{ marginLeft: "60px" }}>
              Equation of State curves
            </center>
            <EOSGraph
              processedData={this.props.processedData}
              selectedCodes={this.props.selectedCodes}
              codeNameFormatting={this.props.codeNameFormatting}
            />
          </div>
          <div
            style={
              {
                // border: "1px solid #999",
              }
            }
          >
            <center style={{ marginLeft: "125px" }}>
              Difference based on the selected measure
            </center>
            <HeatMap
              processedData={this.props.processedData} // only for color
              matrix={this.props.comparisonMatrix}
              selectedCodes={this.props.selectedCodes}
              maxValue={this.props.matrixMax}
              codeNameFormatting={this.props.codeNameFormatting}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UnifiedGraph;
