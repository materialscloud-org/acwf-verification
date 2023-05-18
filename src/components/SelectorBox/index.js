import CodeSelector from "./CodeSelector";
import MeasureSelector from "./MeasureSelector";

import "./SelectorBox.css";

export default function SelectorBox(props) {
  return (
    <div>
      <center>
        <div className="functional_label">
          <span style={{ fontWeight: "600" }}>Functional: PBE</span>
        </div>
      </center>
      <div className="selector_container">
        <CodeSelector
          allCodes={props.allCodes}
          selectedCodes={props.selectedCodes}
          onCodeSelectionChange={props.onCodeSelectionChange}
          codeInfo={props.codeInfo}
          elementData={props.elementData}
        />
        <MeasureSelector onMeasureChange={props.onMeasureChange} />
      </div>
    </div>
  );
}
