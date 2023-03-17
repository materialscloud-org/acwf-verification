import React from "react";

import Form from "react-bootstrap/Form";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./CodeSelector.css";

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

  isCodeEnabled(code) {
    let enabled = false;
    Object.keys(this.props.elementData).forEach((crystal) => {
      if (code in this.props.elementData[crystal]) enabled = true;
    });
    return enabled;
  }

  codeCheckEntry(code, info) {
    let label = (
      <div
        className="code-checkbox"
        // style={{
        //   background: "green",
        // }}
      >
        {info["short_label"]}
      </div>
    );
    return (
      <div
        key={code}
        style={{
          display: "grid",
          gridTemplateColumns: "150px auto",
          paddingLeft: "10px",
          fontSize: 14,
          // background: "red",
        }}
      >
        <Form.Check
          style={{
            gridColumnStart: 1,
            fontWeight: info["fontw"],
            // background: "red",
          }}
          inline={true}
          type={"checkbox"}
          id={code}
          label={label}
          defaultChecked={true}
          onChange={this.handleToggle}
          disabled={!this.isCodeEnabled(code)}
        />
        <div
          style={{
            gridColumnStart: 2,
          }}
        >
          - {code}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="code-selector-container">
        <Container>
          <center>
            <span style={{ fontWeight: "600" }}>Select methods</span>
          </center>
          <div className="method-subheading">All-electron reference:</div>
          {/* AE codes */}
          {this.props.allCodes.map((code, i) => {
            if (this.props.codeInfo[code]["ae"])
              return this.codeCheckEntry(code, this.props.codeInfo[code]);
          })}
          <div className="method-subheading">Pseudopotential methods:</div>
          {this.props.allCodes.map((code, i) => {
            if (!this.props.codeInfo[code]["ae"])
              return this.codeCheckEntry(code, this.props.codeInfo[code]);
          })}
        </Container>
      </div>
    );
  }
}

export default CodeSelector;
