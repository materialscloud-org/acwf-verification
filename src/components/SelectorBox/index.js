import CodeSelector from "./CodeSelector";
import MeasureSelector from "./MeasureSelector";

import "./SelectorBox.css";

export default function SelectorBox(props) {
  return (
    <div>
      <div className="selector_container">
        <CodeSelector
          allCodes={props.allCodes}
          selectedCodes={props.selectedCodes}
          onCodeSelectionChange={props.onCodeSelectionChange}
          codeInfo={props.codeInfo}
          elementData={props.elementData}
        />
        <MeasureSelector
          onMeasureChange={props.onMeasureChange}
          selectedMeasure={props.selectedMeasure}
        />
      </div>
    </div>
  );
}
