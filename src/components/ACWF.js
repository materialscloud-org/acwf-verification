import React from "react";

import PTable from "./PTable";

import UnifiedGraph from "./UnifiedGraph";

import CodeSelector from "./CodeSelector";
import MeasureSelector from "./MeasureSelector";

import "./ACWF.css";

// each element should have 6 oxide and 4 unaries structures, define them here
// some code might be missing some of them
const crystalTypes = {
  oxides: ["X2O", "X2O3", "X2O5", "XO", "XO2", "XO3"],
  unaries: ["X/BCC", "X/Diamond", "X/FCC", "X/SC"],
};

async function loadData() {
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

  var loadedData = {}; // [code][oxides/unaries] = [the json]

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
      //console.log(name);
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

class ACWF extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      allCodes: [],
      selectedCodes: new Set(),
      selectedElement: null,
    };

    this.handleCodeSelectionChange = this.handleCodeSelectionChange.bind(this);
    this.changeElementSelection = this.changeElementSelection.bind(this);
  }

  componentDidMount() {
    loadData().then((loadedData) => {
      this.setState({
        data: loadedData,
        allCodes: Object.keys(loadedData),
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

  changeElementSelection(newElement) {
    if (newElement !== this.state.selectedElement) {
      this.setState({ selectedElement: newElement });
    }
  }

  render() {
    return (
      <div style={{ border: "1px solid #999" }}>
        <center>Select an element:</center>
        <PTable
          onElementSelect={this.changeElementSelection}
          selection={this.state.selectedElement}
        />
        {this.state.selectedElement != null ? (
          <div>
            <div className="selector_container">
              <CodeSelector
                allCodes={this.state.allCodes}
                selectedCodes={this.state.selectedCodes}
                onCodeSelectionChange={this.handleCodeSelectionChange}
              />
              <MeasureSelector />
            </div>
            <div style={{ display: "flex", border: "1px solid #999" }}>
              <div>
                {Object.keys(crystalTypes).map((type) =>
                  crystalTypes[type].map((crystalLabel) => {
                    let label = "Ag-X2O3";
                    return (
                      <UnifiedGraph
                        key={this.state.selectedElement + "-" + crystalLabel}
                        data={this.state.data}
                        type={type}
                        crystal={
                          this.state.selectedElement + "-" + crystalLabel
                        }
                        allCodes={this.state.allCodes}
                        selectedCodes={this.state.selectedCodes}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ACWF;
