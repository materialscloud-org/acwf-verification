import React from "react";

import Form from "react-bootstrap/Form";

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
        <Form.Label>Select comparison measure</Form.Label>
        <Form.Select
          aria-label="Default select example"
          onChange={this.handleChange}
        >
          <option value="nu">ν</option>
          <option value="delta">Δ</option>
          <option value="epsilon">ε </option>
        </Form.Select>
      </div>
    );
  }
}

export default MeasureSelector;
