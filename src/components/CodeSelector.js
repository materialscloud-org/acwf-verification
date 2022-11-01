import React from "react";

import Form from "react-bootstrap/Form";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class CodeSelector extends React.Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle = (e) => {
    var newSelectedCodes = new Set(this.props.selectedCodes);
    // if code was unchecked, remove it from the array
    if (!e.target.checked && newSelectedCodes.has(e.target.id)) {
      newSelectedCodes.delete(e.target.id);
    }
    // if code was checked, add it to the array
    if (e.target.checked && !newSelectedCodes.has(e.target.id)) {
      newSelectedCodes.add(e.target.id);
    }
    this.props.onCodeSelectionChange(newSelectedCodes);
  };

  render() {
    return (
      <div>
        <Container>
          <Form.Label>Select codes</Form.Label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              marginBottom: "30px",
              backgroundColor: "#dde8f6",
            }}
          >
            {this.props.allCodes.map((code, i) => {
              return (
                <Form.Check
                  style={{ gridColumnStart: { i } }}
                  inline={true}
                  type={"checkbox"}
                  id={code}
                  label={code}
                  key={code}
                  defaultChecked={true}
                  onChange={this.handleToggle}
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
