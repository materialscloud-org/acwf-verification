import React, { useState, useMemo, useRef } from "react";

import PeriodicTable from "./PeriodicTable";
import EosAndHeatmap from "./EosAndHeatmap";
import SelectorBox from "./SelectorBox";

import { PTableWrapper } from "./PTableWrapper";
import { symbols } from "mc-periodic-table";

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
  const tableRef = useRef(null);

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
        selectedCodes,
      );
    }
    return null;
  }, [selectedElement, selectedMeasure, selectedCodes, comparisonMatrices]);

  const noInteractArray = useMemo(() => {
    const enabledSymbols = new Set(Object.keys(allData.data));

    const disabledAtomicNumbers = [];

    for (let atomicNumber = 1; atomicNumber < symbols.length; atomicNumber++) {
      const symbol = symbols[atomicNumber];

      if (symbol && !enabledSymbols.has(symbol)) {
        disabledAtomicNumbers.push(atomicNumber);
      }
    }

    return disabledAtomicNumbers;
  }, []);

  console.log(selectedElement);

  return (
    <div className="acwf">
      <PTableWrapper
        ref={tableRef}
        noInteractArray={noInteractArray}
        onChange={(detail) => {
          const activeKey = Object.entries(detail).find(
            ([, v]) => v === 1,
          )?.[0];

          if (!activeKey) return;

          const atomicNumber = Number(activeKey);
          const symbol = symbols[atomicNumber];

          setSelectedElement(symbol);
        }}
        singleMode={true}
      />

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
