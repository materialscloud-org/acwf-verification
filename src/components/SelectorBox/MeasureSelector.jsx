import React from "react";

import Form from "react-bootstrap/Form";

import HelpButton from "../HelpButton";

import Popover from "react-bootstrap/Popover";

import { qualityThersh } from "../../utils/variables";

import "./MeasureSelector.css";

import VisxColorbar from "./VisxColorbar";

const helpPopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Comparison metrics</Popover.Header>
    <Popover.Body>
      <ul className="measures-ul">
        <li>
          <b>ε</b> - a metric that represents the area between the two EOS
          curves normalized by the average variance of the two curves. An
          excellent match is {"ε<" + qualityThersh["epsilon"]["exc"]}, while a
          good match is {"ε<" + qualityThersh["epsilon"]["good"]}.
        </li>
        <li>
          <b>ν</b> - a metric that captures the relative difference of the
          Birch-Murnaghan fitting parameters with specified weights. An
          excellent match is {"ν<" + qualityThersh["nu"]["exc"]}, while a good
          match is {"ν<" + qualityThersh["nu"]["good"]}.
        </li>
        <li>
          <b>Δ</b> - a metric that represents the area between the two EOS
          curves. An excellent match is{" "}
          {"Δ<" + qualityThersh["delta"]["exc"] + " [meV/atom]"}, while a good
          match is {"Δ<" + qualityThersh["delta"]["good"] + " [meV/atom]"}.
        </li>
      </ul>
      See more details in the About section.
      <br />
      The color scale used for the comparison matrixes below is chosen to
      highlight the excellent and good match thresholds, as well as to visualize
      outliers.
    </Popover.Body>
  </Popover>
);

class MeasureSelector extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onMeasureChange(e.target.value);
  }

  render() {
    return (
      <div className="measure-selector-container">
        <center>
          <Form.Label>
            <span style={{ fontWeight: "600" }}>Select comparison metric</span>
          </Form.Label>
        </center>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Form.Select
            style={{ width: "100px" }}
            aria-label="Select measure"
            onChange={this.handleChange}
          >
            <option value="epsilon">ε</option>
            <option value="nu">ν</option>
            <option value="delta">Δ</option>
          </Form.Select>
          <HelpButton popover={helpPopover} />
        </div>
        <center style={{ marginTop: "15px" }}>Color scale used below:</center>
        <div className="cbar-container">
          <VisxColorbar measure={this.props.selectedMeasure} />
        </div>
      </div>
    );
  }
}

export default MeasureSelector;
