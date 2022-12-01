import React from "react";

import PTable from "./PTable";

import UnifiedGraph from "./UnifiedGraph";

import CodeSelector from "./CodeSelector";
import MeasureSelector from "./MeasureSelector";

import Spinner from "react-bootstrap/Spinner";

import { calcComparisonMatrices, calcMatrixMax } from "./DataUtilities";

import "./ACWF.css";

import allData from "../data/data.json";

// List of all codes.
// in principle could be read from data.json, but easier just to define here
// this also defines the order of the codes in the app (e.g. put AE codes first)
const allCodes = [
  "fleur",
  "wien2k",
  "abinit",
  "bigdft",
  "castep",
  "cp2k",
  "gpaw",
  "quantum_espresso",
  "siesta",
  "vasp",
];

// code display name and associated color (from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12)
// for fontweight, "bold" seems a bit too strong
const codeFormatting = {
  fleur: { name: "FLEUR", color: "#a6cee3", fontw: "600" },
  wien2k: { name: "WIEN2k", color: "#1f78b4", fontw: "600" },
  abinit: { name: "Abinit", color: "#b2df8a", fontw: "normal" },
  bigdft: { name: "BigDFT", color: "#33a02c", fontw: "normal" },
  castep: { name: "CASTEP", color: "#fb9a99", fontw: "normal" },
  cp2k: { name: "CP2K", color: "#e31a1c", fontw: "normal" },
  gpaw: { name: "GPAW", color: "#fdbf6f", fontw: "normal" },
  quantum_espresso: {
    name: "Quantum ESPRESSO",
    color: "#ff7f00",
    fontw: "normal",
  },
  siesta: { name: "SIESTA", color: "#cab2d6", fontw: "normal" },
  vasp: { name: "VASP", color: "#6a3d9a", fontw: "normal" },
};

// Crystal order.
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

    this.comparisonMatrices = calcComparisonMatrices(allData["data"], allCodes);
    // console.log(this.comparisonMatrices);

    this.state = {
      selectedCodes: new Set(allCodes),
      selectedElement: null,
      selectedMeasure: "nu",
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
      <div>
        <div style={{ border: "1px solid #999", borderRadius: "20px" }}>
          <center>Select an element:</center>
          <PTable
            onElementSelect={this.changeElementSelection}
            selection={sel_elem}
            enabledElements={new Set(Object.keys(allData["data"]))}
          />
        </div>
        {sel_elem != null ? (
          <div>
            <div className="selector_container">
              <CodeSelector
                allCodes={allCodes}
                selectedCodes={this.state.selectedCodes}
                onCodeSelectionChange={this.handleCodeSelectionChange}
                codeFormatting={codeFormatting}
              />
              <MeasureSelector onMeasureChange={this.handleMeasureChange} />
            </div>
            <div style={{ display: "flex" }}>
              <div>
                {crystalOrder.map((crystal) => {
                  return (
                    <UnifiedGraph
                      key={sel_elem + crystal}
                      element={sel_elem}
                      processedData={allData["data"][sel_elem][crystal]}
                      comparisonMatrix={
                        this.comparisonMatrices[sel_elem][crystal][
                          this.state.selectedMeasure
                        ]
                      }
                      matrixMax={matrixMax}
                      crystal={crystal}
                      allCodes={allCodes}
                      selectedCodes={this.state.selectedCodes}
                      codeFormatting={codeFormatting}
                      measure={this.state.selectedMeasure}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ACWF;
