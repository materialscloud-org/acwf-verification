import React from "react";

import "./CodeSelector.css";

import { HelpButton } from "mc-react-library";

const helpPopover = (
  <HelpButton
    content={
      <>
        <div className="mb-2 text-base font-medium">Methods selection</div>
        This section contains the selection of computational approaches to
        compare. Each approach is represented by a row with the following
        format:
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
      </>
    }
  />
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
        {/* As Bootstrap's inline form-check */}
        <div
          className="mr-4 mb-0.5 inline-block min-h-6 pl-[1.5em]"
          style={{
            gridColumnStart: 1,
            ...fontStyle,
          }}
        >
          <input
            className="float-left -ml-[1.5em] mt-[0.25em] h-[1em] w-[1em] align-top accent-[#0d6efd] disabled:opacity-50"
            type="checkbox"
            id={code}
            defaultChecked={true}
            onChange={this.handleToggle}
            disabled={!this.isCodeEnabled(code)}
          />
          <label
            htmlFor={code}
            className={this.isCodeEnabled(code) ? undefined : "opacity-50"}
          >
            {label}
          </label>
        </div>
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
        <div className="mx-auto w-full px-3">
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
            {helpPopover}
          </div>
          <div className="method-subheading">All-electron reference:</div>
          {this.props.codeOrder.map((code) => {
            let format = this.props.codeFormatting[code];
            if (format["type"] == "methods-ae") {
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
            if (format["type"] == "methods-pp-main") {
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
            if (format["type"] == "methods-pp-contrib") {
              return this.codeCheckEntry(
                code,
                format["shortLabel"],
                format["fontStyle"]
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default CodeSelector;
