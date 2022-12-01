import React from "react";

import { element_symbols } from "./ptable_symbols";

import "./PTable.css";

class Element extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    //if (this.props.disabled) return;
    this.props.onSelectionChange(this.props.symbol);
  }

  render() {
    let e_class = `element element-${this.props.num}`;
    if (this.props.disabled) {
      e_class += " element-disabled";
    }

    if (this.props.num >= 57 && this.props.num <= 71) {
      e_class += " lanthanide";
    }

    if (this.props.symbol === this.props.selected_symbol) {
      e_class += " element-selected";
    }

    return (
      <div className={e_class} onClick={this.handleOnClick}>
        <div className="elem_sym">{this.props.symbol}</div>
      </div>
    );
  }
}

class PTable extends React.Component {
  constructor(props) {
    super(props);
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
          selected_symbol={this.props.selection}
          onSelectionChange={this.props.onElementSelect}
          disabled={!this.props.enabledElements.has(symbol)}
        />
      );
    }
    return items;
  };

  render() {
    return (
      <div className="ptable_outer">
        <div className="ptable">
          {this.makeElements(1, 56)}
          {this.makeElements(72, 88)}
          {this.makeElements(104, 118)}
          {this.makeElements(57, 71)}
          {this.makeElements(89, 103)}
        </div>
      </div>
    );
  }
}

export default PTable;
