import React from "react";

import Form from "react-bootstrap/Form";

import HelpButton from "./HelpButton";

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
            <span style={{ fontWeight: "600" }}>Select comparison measure</span>
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
          <HelpButton />
        </div>
      </div>
    );
  }
}

export default MeasureSelector;
