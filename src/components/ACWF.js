import React from "react";

import PeriodicTable from "./PeriodicTable";

import EosAndHeatmap from "./EosAndHeatmap";

import SelectorBox from "./SelectorBox";

import {
  genCodeOrderAndInfo,
  calcComparisonMatrices,
  calcMatrixMax,
} from "../utils/dataUtilities";

import "./ACWF.css";

import allData from "../data/data.json";

const crystalOrder = [
  "X/SC",
  "X/BCC",
  "X/Diamond",
  "X/FCC",
  "X2O",
  "XO",
  "X2O3",
  "XO2",
  "X2O5",
  "XO3",
];

class ACWF extends React.Component {
  constructor(props) {
    super(props);

    [this.orderedCodes, this.codeInfo] = genCodeOrderAndInfo(allData);

    this.comparisonMatrices = calcComparisonMatrices(
      allData["data"],
      this.orderedCodes
    );
    // console.log(this.comparisonMatrices);

    this.state = {
      selectedCodes: new Set(this.orderedCodes),
      selectedElement: null,
      selectedMeasure: "epsilon",
    };

    this.changeElementSelection = this.changeElementSelection.bind(this);
    this.handleCodeSelectionChange = this.handleCodeSelectionChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
  }

  handleCodeSelectionChange(newSelectedCodes) {
    if (newSelectedCodes !== this.state.selectedCodes) {
      this.setState({ selectedCodes: newSelectedCodes });
    }
  }

  handleMeasureChange(newMeasure) {
    if (newMeasure !== this.state.selectedMeasure) {
      this.setState({ selectedMeasure: newMeasure });
    }
  }

  changeElementSelection(newElement) {
    this.setState({
      selectedElement: newElement,
    });
  }

  render() {
    // calculate the matrix maxvalue across all the crystals of the current element
    var matrixMax = null;
    if (this.state.selectedElement != null) {
      matrixMax = calcMatrixMax(
        this.comparisonMatrices,
        this.state.selectedElement,
        this.state.selectedMeasure,
        this.state.selectedCodes
      );
    }

    var sel_elem = this.state.selectedElement;

    return (
      <div className="acwf">
        <div className="gen_container">
          <PeriodicTable
            onElementSelect={this.changeElementSelection}
            selection={sel_elem}
            enabledElements={new Set(Object.keys(allData["data"]))}
          />
        </div>
        {sel_elem != null ? (
          <div>
            <div className="gen_container">
              <SelectorBox
                allCodes={this.orderedCodes}
                selectedCodes={this.state.selectedCodes}
                onCodeSelectionChange={this.handleCodeSelectionChange}
                codeInfo={this.codeInfo}
                elementData={allData["data"][sel_elem]}
                onMeasureChange={this.handleMeasureChange}
              />
            </div>
            {crystalOrder.map((crystal) => {
              return (
                <div
                  key={sel_elem + crystal}
                  className="gen_container graph_container"
                >
                  <EosAndHeatmap
                    element={sel_elem}
                    processedData={allData["data"][sel_elem][crystal]}
                    comparisonMatrix={
                      this.comparisonMatrices[sel_elem][crystal][
                        this.state.selectedMeasure
                      ]
                    }
                    matrixMax={matrixMax}
                    crystal={crystal}
                    allCodes={this.orderedCodes}
                    selectedCodes={this.state.selectedCodes}
                    codeFormatting={this.codeInfo}
                    measure={this.state.selectedMeasure}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

export default ACWF;
