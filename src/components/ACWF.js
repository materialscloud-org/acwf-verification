import React from "react";

import PTable from "./PTable";

import EOSGraph from "./EOSGraph";

import Example from "./HeatMap";

import BarGraph from "./VisxExample";

import CodeSelector from "./CodeSelector";
import MeasureSelector from "./MeasureSelector";

import "./ACWF.css";

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
    };
  }

  componentDidMount() {
    loadData().then((loadedData) => {
      this.setState({
        data: loadedData,
      });
      console.log(this.state.data);
    });
  }

  render() {
    return (
      <div style={{ border: "1px solid #999" }}>
        <PTable />
        <div className="selector_container">
          <CodeSelector />
          <MeasureSelector />
        </div>
        <div style={{ display: "flex", border: "1px solid #999" }}>
          <div>
            {/* {Object.keys(selectedData).map((code, i) => (
              <EOSGraph
                key={i}
                eos_data={selectedData[code]["eos_data"]["Ag-X2O"]}
                bm_fit={selectedData[code]["BM_fit_data"]["Ag-X2O"]}
              />
            ))} */}
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
