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
          padding: "15px",
          backgroundColor: "#f2f7fc",
          borderRadius: "20px",
        }}
      >
        <Form.Label>Select comparison measure</Form.Label>
        <Form.Select
          aria-label="Default select example"
          onChange={this.handleChange}
        >
          <option value="nu">1000 * nu</option>
          <option value="nu2">100 * nu</option>
        </Form.Select>
      </div>
    );
  }
}

export default MeasureSelector;
