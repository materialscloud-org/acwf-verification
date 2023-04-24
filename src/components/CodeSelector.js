import React from "react";

import Form from "react-bootstrap/Form";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./CodeSelector.css";

import HelpButton from "./HelpButton";

import Popover from "react-bootstrap/Popover";

const helpPopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Methods selection</Popover.Header>
    <Popover.Body>
      This section contains the selection of computational approaches to compare.
      Each approach is represented by a row with the following format:
      <div
        style={{
          backgroundColor: "#F2F7FC",
          border: "1px solid #d6d6d6",
          padding: "6px 12px",
          margin: "6px 10px",
        }}
      >
        short-name &nbsp; &nbsp; - code-name@basis-set|pseudopotential
      </div>
      See more details in the About section
    </Popover.Body>
  </Popover>
);

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "600" }}>Select methods</span>
            <HelpButton popover={helpPopover} />
          </div>
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
