import React from "react";

import Form from "react-bootstrap/Form";

import Container from "react-bootstrap/Container";

import "./CodeSelector.css";

import HelpButton from "../HelpButton";

import Popover from "react-bootstrap/Popover";

const helpPopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Methods selection</Popover.Header>
    <Popover.Body>
      This section contains the selection of computational approaches to
      compare. Each approach is represented by a row with the following format:
      <div
        style={{
          backgroundColor: "#F2F7FC",
          border: "1px solid #d6d6d6",
          padding: "6px 12px",
          margin: "6px 10px",
        }}
      >
        short-name &nbsp; - code-name@basis-set|pseudopotential
      </div>
      See more details in the About section.
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

  codeCheckEntry(code, shortLabel, fontStyle) {
    let label = (
      <div
        className="code-checkbox"
        // style={{
        //   background: "green",
        // }}
      >
        {shortLabel}
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
            ...fontStyle,
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontWeight: "600" }}>Select methods</span>
              <span style={{ textAlign: "center" }}>Functional: PBE</span>
            </div>
            <HelpButton popover={helpPopover} />
          </div>
          <div className="method-subheading">All-electron reference:</div>
          {this.props.codeOrder.map((code) => {
            let format = this.props.codeFormatting[code];
            if (format["type"] == "ae") {
              return this.codeCheckEntry(
                code,
                format["shortLabel"],
                format["fontStyle"]
              );
            }
          })}

          <div className="method-subheading">Pseudopotential methods:</div>
          {this.props.codeOrder.map((code) => {
            let format = this.props.codeFormatting[code];
            if (format["type"] == "pp-main") {
              return this.codeCheckEntry(
                code,
                format["shortLabel"],
                format["fontStyle"]
              );
            }
          })}

          <div className="method-subheading">
            Contributed pseudopotential methods:
          </div>
          {this.props.codeOrder.map((code) => {
            let format = this.props.codeFormatting[code];
            if (format["type"] == "pp-contrib") {
              return this.codeCheckEntry(
                code,
                format["shortLabel"],
                format["fontStyle"]
              );
            }
          })}
        </Container>
      </div>
    );
  }
}

export default CodeSelector;
