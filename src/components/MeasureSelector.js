import React from "react";

import Form from "react-bootstrap/Form";

import HelpButton from "./HelpButton";

import Popover from "react-bootstrap/Popover";

import { qualityThersh } from "./about";

import "./MeasureSelector.css";

const helpPopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Comparison metrics</Popover.Header>
    <Popover.Body>
      <ul className="measures-ul">
        <li>
          ν - a metric that captures the relative difference of the
          Birch-Murnaghan fitting parameters with specified weights. An
          excellent match is {"ν<" + qualityThersh["nu"]["exc"]}, while a good
          match is {"ν<" + qualityThersh["nu"]["good"]}.
        </li>
        <li>
          ε - a metric that represents the area between the two EOS curves
          normalized by the average value of the two curves. An excellent match
          is {"ε<" + qualityThersh["epsilon"]["exc"]}, while a good match is{" "}
          {"ε<" + qualityThersh["epsilon"]["good"]}.
        </li>
        <li>
          Δ - a metric that represents the area between the two EOS curves. An
          excellent match is{" "}
          {"Δ<" + qualityThersh["delta"]["exc"] + " [meV/atom]"}, while a good
          match is {"Δ<" + qualityThersh["delta"]["good"] + " [meV/atom]"}.
        </li>
      </ul>
      See more details in the About section.
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
      <div
        style={{
          marginBottom: "10px",
          marginTop: "10px",
          paddingTop: "5px",
          paddingBottom: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          backgroundColor: "#f2f7fc",
          borderRadius: "20px",
        }}
      >
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
            <option value="nu">ν</option>
            <option value="epsilon">ε</option>
            <option value="delta">Δ</option>
          </Form.Select>
          <HelpButton popover={helpPopover} />
        </div>
      </div>
    );
  }
}

export default MeasureSelector;
