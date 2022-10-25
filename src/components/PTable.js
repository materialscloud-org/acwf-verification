import React from "react";

import { element_symbols } from "./ptable_symbols";

import "./PTable.css";

class Element extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    //if (this.props.disabled) return;
    this.props.onSelectionChange(this.props.num);
  }

  render() {
    let e_class = `element element-${this.props.num}`;

    if (this.props.num >= 58 && this.props.num <= 71) {
      e_class += " lanthanide";
    }

    if (this.props.num === this.props.selected_id) {
      e_class += " element-selected";
    }

    return (
      <div
        className={e_class}
        onClick={this.handleOnClick}
      >
        <div className="elem_sym">{this.props.symbol}</div>
      </div>
    );
  }
}

class PTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
    };

    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  onSelectionChange(new_sel) {
    this.setState({ selected: new_sel });
  }

  makeElements = (start, end) => {
    let items = [];
    for (let i = start; i <= end; i++) {
      let symbol = element_symbols[i];

      items.push(
        <Element
          key={i}
          num={i}
          symbol={symbol}
          selected_id={this.state.selected}
          onSelectionChange={this.onSelectionChange}
        />
      );
    }
    return items;
  };

  render() {
    return (
      <div className="ptable_outer">
        <div className="ptable">
          {this.makeElements(1, 57)}
          {this.makeElements(72, 89)}
          {this.makeElements(104, 118)}
          {this.makeElements(58, 71)}
          {this.makeElements(90, 103)}
        </div>
      </div>
    );
  }
}

export default PTable;
