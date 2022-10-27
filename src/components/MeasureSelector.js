import React from "react";

import Form from "react-bootstrap/Form";

class MeasureSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var listOfMeasures = [
      "abinit",
      "ae",
      "bigdft",
      "castep",
      "cp2k",
      "fleur",
      "gpaw",
      "quantum_espresso",
      "siesta",
      "vasp",
      "wien2k",
    ];

    return (
      <div>
        <Form.Label>Select measure</Form.Label>
        <Form.Select aria-label="Default select example">
          <option value="1">nu</option>
          <option value="1">other</option>
        </Form.Select>
      </div>
    );
  }
}

export default MeasureSelector;
