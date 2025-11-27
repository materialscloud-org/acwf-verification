import React from "react";
import {
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  Dot,
} from "recharts";

import "./EOSGraph.css";

// calculate BM energy based on the fit parameters for volume v
function birch_murnaghan(v, bm_fit) {
  var v0 = bm_fit["min_volume"];
  var b0 = bm_fit["bulk_modulus_ev_ang3"];
  var b01 = bm_fit["bulk_deriv"];
  var e0 = bm_fit["E0"];
  var r = (v0 / v) ** (2.0 / 3.0);
  return (
    (9.0 / 16.0) *
    b0 *
    v0 *
    ((r - 1.0) ** 3 * b01 + (r - 1.0) ** 2 * (6.0 - 4.0 * r))
  );
}

function birch_murnaghan_array(v_min, v_max, bm_fit, extra_v) {
  let bm_arr = [];
  let step = (v_max - v_min) / 50;
  let v_arr = [];
  for (let v = v_min; v < v_max + step; v += step) {
    v_arr.push(v);
  }
  v_arr = v_arr.concat(extra_v);
  v_arr.sort((a, b) => a - b);
  v_arr.forEach((v) => {
    bm_arr.push({ v: v, e: 1000 * birch_murnaghan(v, bm_fit) });
  });

  return bm_arr;
}

function tickRange(start, stop, step) {
  // this function tries to use an integer step,
  // but will keep the array below 100
  var arr = [];
  if ((stop - start) / step > 15) {
    step = (stop - start) / 15;
  }
  for (var i = start; i < stop; i += step) {
    arr.push(i);
  }
  return arr;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    let plSorted = payload.slice(0).sort((a, b) => {
      return b.value - a.value;
    });
    return (
      <div className="eos-tooltip">
        {label.toFixed(2)} <br />
        {plSorted.map((e) => {
          if (!e.name.endsWith("_dots")) {
            return (
              <div key={e.name}>
                <span style={{ color: e.color }}>{e.name}</span>:{" "}
                {e.value.toFixed(4)}
              </div>
            );
          }
        })}
      </div>
    );
  }
  return null;
};

class EOSGraph extends React.Component {
  constructor(props) {
    super(props);
    // this.props.processedData[code] = { eos_data_per_atom, bm_fit_per_atom }

    this.width = 400;
    this.height = 380;
    this.margins = {
      top: 5,
      right: 15,
      left: 15,
      bottom: 25,
    };
  }

  vLimits() {
    // go through all datasets to determine v_min and v_max
    var v_min = Number.MAX_SAFE_INTEGER;
    var v_max = -Number.MAX_SAFE_INTEGER;
    for (const code of Object.keys(this.props.processedData)) {
      if (!this.props.selectedCodes.has(code)) continue;
      let eos_data = this.props.processedData[code]["eos_data_per_atom"];
      let bm_fit = this.props.processedData[code]["bm_fit_per_atom"];
      if (eos_data != null) {
        var this_v_min = Math.min(...eos_data.map((x) => x[0]));
        var this_v_max = Math.max(...eos_data.map((x) => x[0]));
      } else {
        let v0 = bm_fit["min_volume"];
        var this_v_min = 0.94 * v0;
        var this_v_max = 1.06 * v0;
      }
      if (this_v_min < v_min) v_min = this_v_min;
      if (this_v_max > v_max) v_max = this_v_max;
    }
    // round v_min, v_max to 0.1, add some margin
    v_min = Math.floor(v_min * 10) / 10 - 0.1;
    v_max = Math.ceil(v_max * 10) / 10 + 0.1;

    return [v_min, v_max];
  }

  uniqueEOSPointsV() {
    // not all "discrete" points have the same x-axis (v) value
    // find all the unique ones

    var all_eos_points = [];
    for (const code of this.props.codeOrder) {
      if (!this.props.selectedCodes.has(code)) continue;
      if (!(code in this.props.processedData)) continue;
      let eos_data = this.props.processedData[code]["eos_data_per_atom"];
      let bm_fit = this.props.processedData[code]["bm_fit_per_atom"];
      if (eos_data == null || bm_fit == null) continue;
      all_eos_points.push(...eos_data.map((x) => x[0]));
    }
    all_eos_points.sort((a, b) => a - b);
    var unique_eos_points = all_eos_points.filter((v, index, arr) => {
      return index == 0 || Math.abs(arr[index - 1] - v) > 1e-8;
    });

    return unique_eos_points;
  }

  render() {
    // if the inputData is empty, don't render anything
    if (Object.keys(this.props.processedData).length === 0)
      return (
        <ComposedChart
          width={this.width}
          height={this.height}
          margin={this.margins}
        ></ComposedChart>
      );

    // console.log(this.props.processedData);

    var chartDataAll = {};
    // data will be structured as
    // chartDataAll = {
    // code1: {points: {v, e}, fit: {v, e}}
    // code2: ...
    //}

    var lineOrder = [];

    const [v_min, v_max] = this.vLimits();

    // find unique eos_data points to also feed to the continuous line
    // to show the tooltip there as well
    const unique_eos_points = this.uniqueEOSPointsV();

    var e_max = 0.0;

    // go through all datasets and prepare the plotting data
    for (const code of this.props.codeOrder) {
      if (!this.props.selectedCodes.has(code)) continue;
      if (!(code in this.props.processedData)) continue;
      let eos_data = this.props.processedData[code]["eos_data_per_atom"];
      let bm_fit = this.props.processedData[code]["bm_fit_per_atom"];
      if (bm_fit == null) continue;

      lineOrder.push(code);

      chartDataAll[code] = {
        fit: birch_murnaghan_array(v_min, v_max, bm_fit, unique_eos_points),
      };

      if (eos_data != null) {
        var eos_points = eos_data.map((x) => ({
          v: x[0],
          e: 1000 * (x[1] - bm_fit["E0"]),
        }));

        chartDataAll[code]["points"] = eos_points;
      }

      let this_e_max = Math.max(
        ...chartDataAll[code]["fit"].map((x) => x["e"])
      );
      if (this_e_max > e_max) e_max = this_e_max;
    }

    // calculate tick positions
    var xticks = tickRange(Math.ceil(v_min), Math.floor(v_max) + 1, 1.0);
    e_max += 0.005;
    var yticks = tickRange(0.0, e_max, 0.01);

    // console.log(chartDataAll);

    return (
      <div>
        <ComposedChart
          width={this.width}
          height={this.height}
          margin={this.margins}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="v"
            type="number"
            domain={[v_min, v_max]}
            tickFormatter={(value) => value.toFixed(1)}
            allowDuplicatedCategory={false}
            ticks={xticks}
            // label={{ value: "Cell volume [Å]", position: "bottom", fontSize: 14 }}
            fontSize={12}
          />
          <YAxis
            type="number"
            domain={[-0.004, e_max]}
            tickFormatter={(value) => value.toFixed(1)}
            ticks={yticks}
            label={{
              value: "Energy per atom [meV]",
              angle: -90,
              position: "left",
              offset: -5,
              style: { textAnchor: "middle" },
              fontSize: 14,
            }}
            fontSize={12}
          />
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{ outline: "none" }}
          />

          {lineOrder.map(function (code) {
            let name = this.props.codeFormatting[code]["shortLabel"];
            return (
              <Line
                key={code + "-fit"}
                data={chartDataAll[code]["fit"]}
                dataKey="e"
                dot={false}
                activeDot={false}
                stroke={this.props.codeFormatting[code]["color"]}
                name={name}
                isAnimationActive={false}
                strokeWidth={2}
              />
            );
          }, this)}
          {lineOrder.map(function (code) {
            let name = this.props.codeFormatting[code]["shortLabel"];
            if ("points" in chartDataAll[code]) {
              return (
                <Line
                  key={code + "-points"}
                  data={chartDataAll[code]["points"]}
                  dataKey="e"
                  name={name + "_dots"}
                  strokeWidth={0}
                  stroke={this.props.codeFormatting[code]["color"]}
                  dot={{
                    stroke: this.props.codeFormatting[code]["color"],
                    fill: this.props.codeFormatting[code]["color"],
                    strokeWidth: 1,
                  }}
                  activeDot={false}
                  isAnimationActive={false}
                />
              );
            }
          }, this)}
        </ComposedChart>
        <center
          style={{ fontSize: 14, marginTop: "-25px", marginLeft: "45px" }}
        >
          Cell volume per atom [Å<sup>3</sup>]
        </center>
      </div>
    );
  }
}

export default EOSGraph;
