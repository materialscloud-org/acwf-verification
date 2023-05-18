import React from "react";

import EOSGraph from "./EOSGraph";

import HeatMap from "./HeatMap";

function isCharNum(c) {
  return c >= "0" && c <= "9";
}

function formatLabel(elem, crystalLabel) {
  let jsx = [];
  if (crystalLabel == "X/SC") {
    jsx.push(` ${elem} (simple cubic)`);
  } else if (crystalLabel == "X/BCC") {
    jsx.push(` ${elem} (BCC)`);
  } else if (crystalLabel == "X/FCC") {
    jsx.push(` ${elem} (FCC)`);
  } else if (crystalLabel == "X/Diamond") {
    jsx.push(` ${elem} (diamond)`);
  } else {
    let formula = " " + crystalLabel.split("X").join(elem);
    for (var i = 0; i < formula.length; i++) {
      if (isCharNum(formula[i])) jsx.push(<sub key={i}>{formula[i]}</sub>);
      else jsx.push(formula[i]);
    }
  }

  return (
    <b>
      Compound:
      {jsx}
    </b>
  );
}

function heatmapTitle(measure) {
  if (measure == "nu") {
    return "EOS discrepancy: ν";
  }
  if (measure == "epsilon") {
    return "EOS discrepancy: ε";
  }
  if (measure == "delta") {
    return "EOS discrepancy: Δ per atom [meV]";
  }
  return "error";
}

class EosAndHeatmap extends React.Component {
  // Unified graph consisting of the EOS plot and the heatmap
  // Specific to one single crystal
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <center>{formatLabel(this.props.element, this.props.crystal)}</center>
        <div
          style={{
            display: "flex",
            alignItems: "top",
            justifyContent: "space-evenly",
          }}
        >
          <div>
            <center style={{ marginLeft: "60px" }}>
              Equation of States (EOS)
            </center>
            <EOSGraph
              processedData={this.props.processedData}
              selectedCodes={this.props.selectedCodes}
              codeFormatting={this.props.codeFormatting}
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
              {heatmapTitle(this.props.measure)}
            </center>
            <HeatMap
              matrix={this.props.comparisonMatrix}
              selectedCodes={this.props.selectedCodes}
              maxValue={this.props.matrixMax}
              measure={this.props.measure}
              codeFormatting={this.props.codeFormatting}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default EosAndHeatmap;
