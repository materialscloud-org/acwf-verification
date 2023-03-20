import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import "./HelpButton.css";

function HelpButton(props) {
  return (
    <div className="help-button-outer">
      <OverlayTrigger trigger="click" placement="top" overlay={props.popover}>
        <div className="help-button-inner">
          <span className="help_text">?</span>
        </div>
      </OverlayTrigger>
    </div>
  );
}

export default HelpButton;
