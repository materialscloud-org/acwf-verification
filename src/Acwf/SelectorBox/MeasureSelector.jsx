import React from "react";

import { HelpButton } from "mc-react-library";

import { qualityThersh } from "../variables";

import "./MeasureSelector.css";

import VisxColorbar from "./VisxColorbar";

// Bootstrap's form-select chevron
const CHEVRON =
  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e\")";

const helpPopover = (
  <HelpButton
    content={
      <>
        <div className="mb-2 text-base font-medium">Comparison metrics</div>
        <ul className="measures-ul">
          <li>
            <b>ε</b> - a metric that represents the area between the two EOS
            curves normalized by the average variance of the two curves. An
            excellent match is {"ε<" + qualityThersh["epsilon"]["exc"]}, while a
            good match is {"ε<" + qualityThersh["epsilon"]["good"]}.
          </li>
          <li>
            <b>ν</b> - a metric that captures the relative difference of the
            Birch-Murnaghan fitting parameters with specified weights. An
            excellent match is {"ν<" + qualityThersh["nu"]["exc"]}, while a good
            match is {"ν<" + qualityThersh["nu"]["good"]}.
          </li>
          <li>
            <b>Δ</b> - a metric that represents the area between the two EOS
            curves. An excellent match is{" "}
            {"Δ<" + qualityThersh["delta"]["exc"] + " [meV/atom]"}, while a good
            match is {"Δ<" + qualityThersh["delta"]["good"] + " [meV/atom]"}.
          </li>
        </ul>
        See more details in the About section.
        <br />
        The color scale used for the comparison matrixes below is chosen to
        highlight the excellent and good match thresholds, as well as to
        visualize outliers.
      </>
    }
  />
);

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
      <div className="measure-selector-container">
        <center>
          <label className="mb-2 inline-block" htmlFor="measure-select">
            <span style={{ fontWeight: "600" }}>Select comparison metric</span>
          </label>
        </center>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <select
            id="measure-select"
            className="block appearance-none rounded-[0.375rem] border border-[#ced4da] bg-white bg-no-repeat py-[0.375rem] pr-9 pl-3 text-base leading-normal text-[#212529] focus:border-[#86b7fe] focus:outline-none focus:ring-4 focus:ring-[#0d6efd]/25"
            style={{
              width: "100px",
              backgroundImage: CHEVRON,
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "16px 12px",
            }}
            aria-label="Select measure"
            onChange={this.handleChange}
          >
            <option value="epsilon">ε</option>
            <option value="nu">ν</option>
            <option value="delta">Δ</option>
          </select>
          {helpPopover}
        </div>
        <center style={{ marginTop: "15px" }}>Color scale used below:</center>
        <div className="cbar-container">
          <VisxColorbar measure={this.props.selectedMeasure} />
        </div>
      </div>
    );
  }
}

export default MeasureSelector;
