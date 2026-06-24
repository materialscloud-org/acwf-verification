import CodeSelector from "./CodeSelector";
import MeasureSelector from "./MeasureSelector";

import "./SelectorBox.css";

export default function SelectorBox(props) {
  return (
    <div>
      <div className="selector_container">
        <CodeSelector
          codeOrder={props.codeOrder}
          codeFormatting={props.codeFormatting}
          selectedCodes={props.selectedCodes}
          onCodeSelectionChange={props.onCodeSelectionChange}
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
