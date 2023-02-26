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

  render() {
    return (
      <div className="code-selector-container">
        <Container>
          <center>
            <span style={{ fontWeight: "600" }}>Select methods</span>
          </center>
          <div className="method-subheading">All-electron reference:</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px auto",
              paddingLeft: "10px",
              // marginBottom: "10px",
              // backgroundColor: "#dde8f6",
            }}
          >
            {/* AE codes */}
            {this.props.allCodes.map((code, i) => {
              if (this.props.codeFormatting[code]["ae"])
                return (
                  <Form.Check
                    style={{
                      gridColumnStart: { i },
                      fontWeight: this.props.codeFormatting[code]["fontw"],
                    }}
                    inline={true}
                    type={"checkbox"}
                    id={code}
                    label={this.props.codeFormatting[code]["name"]}
                    key={code}
                    defaultChecked={true}
                    onChange={this.handleToggle}
                  />
                );
            })}
          </div>
          <div className="method-subheading">Other methods:</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px auto",
              paddingLeft: "10px",
              // marginBottom: "10px",
              // backgroundColor: "#dde8f6",
            }}
          >
            {/* Other codes */}
            {this.props.allCodes.map((code, i) => {
              if (!this.props.codeFormatting[code]["ae"])
                return (
                  <Form.Check
                    style={{
                      gridColumnStart: { i },
                      fontWeight: this.props.codeFormatting[code]["fontw"],
                    }}
                    inline={true}
                    type={"checkbox"}
                    id={code}
                    label={this.props.codeFormatting[code]["name"]}
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
