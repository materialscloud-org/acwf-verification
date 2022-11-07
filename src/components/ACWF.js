import React from "react";

import PTable from "./PTable";

import UnifiedGraph from "./UnifiedGraph";

import CodeSelector from "./CodeSelector";
import MeasureSelector from "./MeasureSelector";

import {
  processData,
  calcComparisonMatrices,
  calcMatrixMax,
} from "./DataUtilities";

import "./ACWF.css";

// each element should have 6 oxide and 4 unaries structures, define them here
// some code might be missing some of them
const crystalTypes = {
  oxides: ["X2O", "X2O3", "X2O5", "XO", "XO2", "XO3"],
  unaries: ["X/BCC", "X/Diamond", "X/FCC", "X/SC"],
};

// In principle we could scan all the loaded data at the start to automatically determine this,
// but it would slow down the initial load. Hard-code this for now.
const disabledElements = new Set([
  "Rf",
  "Db",
  "Sg",
  "Bh",
  "Hs",
  "Mt",
  "Ds",
  "Rg",
  "Cn",
  "Nh",
  "Fl",
  "Mc",
  "Lv",
  "Ts",
  "Og",
  "Bk",
  "Cf",
  "Es",
  "Fm",
  "Md",
  "No",
  "Lr",
]);

const codeNameFormatting = {
  abinit: "Abinit",
  bigdft: "BigDFT",
  castep: "CASTEP",
  cp2k: "CP2K",
  fleur: "FLEUR (AE)",
  gpaw: "GPAW",
  quantum_espresso: "Quantum ESPRESSO",
  siesta: "SIESTA",
  vasp: "VASP",
  wien2k: "WIEN2k (AE)",
};

const allElectronCodes = new Set(["wien2k", "fleur"]);

const skipCodes = new Set(["ae"]);

async function loadData() {
  // Load the source JSON files that contain the following keys
  // [
  //   BM_fit_data, completely_off, eos_data, failed_wfs, missing_outputs,
  //   num_atoms_in_sim_cell, script_version, set_name, stress_data, uuid_mapping
  // ]
  // This function returns:
  // loadedData[code][oxides/unaries] = {the loaded json}

  var loadedData = {};

  var final_data_folder = "extra_scripts/final_boxplot_all_codes/data/";
  var root_url =
    "https://raw.githubusercontent.com/aiidateam/acwf-verification-scripts/main/";

  // 1. get a list of all files in the repo
  const responseJson = await fetch(
    "https://api.github.com/repos/aiidateam/acwf-verification-scripts/git/trees/main?recursive=1"
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });

  // 2. go through the list of files, if they're a json in the final_data_folder,
  // load it from raw.githubusercontent.com
  for (const fileobj of responseJson["tree"]) {
    let path = fileobj["path"];
    if (path.startsWith(final_data_folder) && path.endsWith(".json")) {
      // example name: results-oxides-verification-PBE-v1-abinit.json
      let name = path.split("/").pop().split(".")[0];
      let nameSplit = name.split("-");
      let type = nameSplit[1];
      let code = nameSplit[5];

      if (skipCodes.has(code)) continue;

      if (!(code in loadedData)) loadedData[code] = {};

      // load the json file
      const fileResponseJson = await fetch(root_url + path)
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });

      loadedData[code][type] = fileResponseJson;
    }
  }
  return loadedData;
}

function orderCodes(codesList) {
  // order codes such that
  // 1. AE codes are in front
  // 2. alphabetical order otherwise

  var sorted = codesList.sort();
  var aeCodes = [];
  var otherCodes = [];
  for (var code of sorted) {
    if (allElectronCodes.has(code)) aeCodes.push(code);
    else otherCodes.push(code);
  }
  return aeCodes.concat(otherCodes);
}

class ACWF extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rawData: {},
      allCodes: [],
      selectedCodes: new Set(),
      selectedElement: null,
      selectedMeasure: "nu",
      processedData: null,
      comparisonMatrices: null,
    };

    this.changeElementSelection = this.changeElementSelection.bind(this);
    this.handleCodeSelectionChange = this.handleCodeSelectionChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
  }

  componentDidMount() {
    loadData().then((loadedData) => {
      this.setState({
        rawData: loadedData,
        allCodes: orderCodes(Object.keys(loadedData)),
        selectedCodes: new Set(Object.keys(loadedData)),
      });
      console.log("LOADED:", loadedData);
    });
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
    if (newElement !== this.state.selectedElement) {
      var processedData = processData(
        this.state.rawData,
        this.state.allCodes,
        newElement
      );
      this.setState({
        selectedElement: newElement,
        processedData: processedData,
        comparisonMatrices: calcComparisonMatrices(processedData),
      });
      console.log(processedData);
    }
  }

  render() {
    // calculate the matrix maxvalue across all the crystals of the current element
    var matrixMax = null;
    if (this.state.selectedElement != null) {
      matrixMax = calcMatrixMax(
        this.state.comparisonMatrices,
        this.state.selectedMeasure,
        this.state.selectedCodes
      );
    }

    return (
      <div>
        <div style={{ border: "1px solid #999", borderRadius: "20px" }}>
          <center>Select an element:</center>
          <PTable
            onElementSelect={this.changeElementSelection}
            selection={this.state.selectedElement}
            disabledElements={disabledElements}
          />
        </div>
        {this.state.selectedElement != null ? (
          <div>
            <div className="selector_container">
              <CodeSelector
                allCodes={this.state.allCodes}
                selectedCodes={this.state.selectedCodes}
                onCodeSelectionChange={this.handleCodeSelectionChange}
                codeNameFormatting={codeNameFormatting}
              />
              <MeasureSelector onMeasureChange={this.handleMeasureChange} />
            </div>
            <div style={{ display: "flex" }}>
              <div>
                {Object.keys(this.state.processedData).map((crystal) => {
                  return (
                    <UnifiedGraph
                      key={crystal}
                      processedData={this.state.processedData[crystal]}
                      comparisonMatrix={
                        this.state.comparisonMatrices[crystal][
                          this.state.selectedMeasure
                        ]
                      }
                      matrixMax={matrixMax}
                      // measure={this.state.selectedMeasure}
                      crystal={crystal}
                      allCodes={this.state.allCodes}
                      selectedCodes={this.state.selectedCodes}
                      codeNameFormatting={codeNameFormatting}
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
