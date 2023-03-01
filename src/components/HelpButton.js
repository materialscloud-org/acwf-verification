import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import Popover from "react-bootstrap/Popover";

import "./HelpButton.css";

const popover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Comparison measures</Popover.Header>
    <Popover.Body>
      <ul style={{ listStyle: "none" }}>
        <li>ν - explanation, possibly formula</li>
        <li>Δ - ...</li>
        <li>ε - ...</li>
      </ul>
      See more details in the About section.
    </Popover.Body>
  </Popover>
);

function HelpButton(props) {
  return (
    <div className="help-button-outer">
      <OverlayTrigger trigger="click" placement="top" overlay={popover}>
        <div className="help-button-inner">
          <span className="help_text">?</span>
        </div>
      </OverlayTrigger>
    </div>
  );
}

export default HelpButton;
