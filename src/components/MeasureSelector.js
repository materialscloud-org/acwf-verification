import React from "react";

import Form from "react-bootstrap/Form";

class MeasureSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Form.Label>Select comparison measure</Form.Label>
        <Form.Select aria-label="Default select example">
          <option value="1">1000 * nu</option>
        </Form.Select>
      </div>
    );
  }
}

export default MeasureSelector;
