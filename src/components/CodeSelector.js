import React from "react";

import Form from "react-bootstrap/Form";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class CodeSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var listOfCodes = [
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
        <Container>
          <Form.Label>Select codes</Form.Label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              marginBottom: "30px",
              backgroundColor: "lightblue",
            }}
          >
            {listOfCodes.map((code, i) => {
              return (
                <Form.Check
                  style={{ gridColumnStart: { i } }}
                  inline={true}
                  type={"checkbox"}
                  id={code}
                  label={code}
                  key={code}
                />
              );
            })}
          </div>
        </Container>
      </div>
    );
  }
}

export default CodeSelector;
