import React, { useState, useMemo } from "react";

import PeriodicTable from "./PeriodicTable";
import EosAndHeatmap from "./EosAndHeatmap";
import SelectorBox from "./SelectorBox";

import {
  getCodeOrderAndFormatting,
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

const ACWF = () => {
  // 1. Initial Data Calculation (mimicking constructor logic)
  // We use useMemo with an empty dependency array [] so this only calculates once on mount.
  const { codeOrder, codeFormatting, comparisonMatrices } = useMemo(() => {
    const [order, formatting] = getCodeOrderAndFormatting(allData["metadata"]);
    const matrices = calcComparisonMatrices(allData["data"], order);
    return {
      codeOrder: order,
      codeFormatting: formatting,
      comparisonMatrices: matrices,
    };
  }, []);

  // 2. State Management
  const [selectedCodes, setSelectedCodes] = useState(new Set(codeOrder));
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedMeasure, setSelectedMeasure] = useState("epsilon");

  // 3. Handlers
  const handleCodeSelectionChange = (newSelectedCodes) => {
    if (newSelectedCodes !== selectedCodes) {
      setSelectedCodes(newSelectedCodes);
    }
  };

  const handleMeasureChange = (newMeasure) => {
    if (newMeasure !== selectedMeasure) {
      setSelectedMeasure(newMeasure);
    }
  };

  const changeElementSelection = (newElement) => {
    setSelectedElement(newElement);
  };

  // 4. Derived Data (Render Logic)
  // Calculate matrixMax only when dependencies change
  const matrixMax = useMemo(() => {
    if (selectedElement != null) {
      return calcMatrixMax(
        comparisonMatrices,
        selectedElement,
        selectedMeasure,
        selectedCodes
      );
    }
    return null;
  }, [selectedElement, selectedMeasure, selectedCodes, comparisonMatrices]);

  return (
    <div className="acwf">
      <div className="gen_container">
        <PeriodicTable
          onElementSelect={changeElementSelection}
          selection={selectedElement}
          enabledElements={new Set(Object.keys(allData["data"]))}
        />
      </div>
      {selectedElement != null ? (
        <div>
          <div className="gen_container">
            <SelectorBox
              codeOrder={codeOrder}
              codeFormatting={codeFormatting}
              selectedCodes={selectedCodes}
              onCodeSelectionChange={handleCodeSelectionChange}
              elementData={allData["data"][selectedElement]}
              onMeasureChange={handleMeasureChange}
              selectedMeasure={selectedMeasure}
            />
          </div>
          {crystalOrder.map((crystal) => {
            return (
              <div
                key={selectedElement + crystal}
                className="gen_container graph_container"
              >
                <EosAndHeatmap
                  codeOrder={codeOrder}
                  codeFormatting={codeFormatting}
                  element={selectedElement}
                  processedData={allData["data"][selectedElement][crystal]}
                  comparisonMatrix={
                    comparisonMatrices[selectedElement][crystal][
                      selectedMeasure
                    ]
                  }
                  matrixMax={matrixMax}
                  crystal={crystal}
                  selectedCodes={selectedCodes}
                  measure={selectedMeasure}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ACWF;
