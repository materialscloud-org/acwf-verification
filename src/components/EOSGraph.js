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

function birch_murnaghan_array(v_min, v_max, bm_fit) {
  let bm_arr = [];
  let step = (v_max - v_min) / 50;
  for (let v = v_min; v < v_max + step; v += step) {
    bm_arr.push({ v: v, e: birch_murnaghan(v, bm_fit) });
  }
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

class EOSGraph extends React.Component {
  constructor(props) {
    super(props);
    // this.props.inputData[code] = { color, eos_data, bm_fit }

    this.width = 400;
    this.height = 380;
    this.margins = {
      top: 5,
      right: 15,
      left: 15,
      bottom: 25,
    };
  }

  render() {
    // if the inputData is empty, don't render anything
    if (Object.keys(this.props.inputData).length === 0)
      return (
        <ComposedChart
          width={this.width}
          height={this.height}
          margin={this.margins}
        ></ComposedChart>
      );

    var chartDataAll = {};
    // data will be structured as
    // chartDataAll = {
    // code1: {points: {v, e}, fit: {v, e}}
    // code2: ...
    //}

    // go through all datasets to determine v_min and v_max
    var v_min = 1000;
    var v_max = -1000;
    for (const code of Object.keys(this.props.inputData)) {
      let eos_data = this.props.inputData[code]["eos_data"];
      let bm_fit = this.props.inputData[code]["bm_fit"];
      if (eos_data == null || bm_fit == null) continue;
      let this_v_min = Math.min(...eos_data.map((x) => x[0]));
      let this_v_max = Math.max(...eos_data.map((x) => x[0]));
      if (this_v_min < v_min) v_min = this_v_min;
      if (this_v_max > v_max) v_max = this_v_max;
    }
    // round v_min, v_max to 0.1, add some margin
    v_min = Math.floor(v_min * 10) / 10 - 0.1;
    v_max = Math.ceil(v_max * 10) / 10 + 0.1;

    var e_max = 0.0;

    // go through all datasets and prepare the plotting data
    for (const code of Object.keys(this.props.inputData)) {
      let eos_data = this.props.inputData[code]["eos_data"];
      let bm_fit = this.props.inputData[code]["bm_fit"];
      if (eos_data == null || bm_fit == null) continue;

      var eos_points = eos_data.map((x) => ({
        v: x[0],
        e: x[1] - bm_fit["E0"],
      }));

      chartDataAll[code] = {
        points: eos_points,
        fit: birch_murnaghan_array(v_min, v_max, bm_fit),
      };

      let this_e_max = Math.max(
        ...chartDataAll[code]["fit"].map((x) => x["e"])
      );
      if (this_e_max > e_max) e_max = this_e_max;
    }

    console.log(chartDataAll);

    // calculate tick positions
    var xticks = tickRange(Math.ceil(v_min), Math.floor(v_max) + 1, 1.0);
    e_max += 0.005;
    var yticks = tickRange(0.0, e_max, 0.01);

    return (
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
          label={{ value: "Cell volume [Å]", position: "bottom", fontSize: 14 }}
          fontSize={12}
        />
        <YAxis
          type="number"
          domain={[-0.004, e_max]}
          tickFormatter={(value) => value.toFixed(2)}
          ticks={yticks}
          label={{
            value: "Energy [eV]",
            angle: -90,
            position: "left",
            fontSize: 14,
          }}
          fontSize={12}
        />
        <Tooltip
          // content={<CustomTooltip />}
          formatter={(value, name) => {
            return value.toFixed(4);
          }}
          labelFormatter={(value) => value.toFixed(2)}
          itemSorter={(item) => {
            return -item.value;
          }}
          itemStyle={{ fontSize: 12 }}
          labelStyle={{ fontSize: 12 }}
        />

        {Object.keys(chartDataAll).map(function (key) {
          return (
            <Line
              key={key + "-fit"}
              data={chartDataAll[key]["fit"]}
              dataKey="e"
              dot={false}
              activeDot={false}
              stroke={this.props.inputData[key]["color"]}
              name={key}
              isAnimationActive={false}
              strokeWidth={2}
            />
          );
        }, this)}
        {Object.keys(chartDataAll).map(function (key) {
          return (
            <Line
              key={key + "-points"}
              data={chartDataAll[key]["points"]}
              dataKey="e"
              name={key}
              strokeWidth={0}
              stroke={this.props.inputData[key]["color"]}
              dot={{
                stroke: this.props.inputData[key]["color"],
                fill: this.props.inputData[key]["color"],
                strokeWidth: 1,
              }}
              activeDot={false}
              isAnimationActive={false}
            />
          );
        }, this)}
      </ComposedChart>
    );
  }
}

export default EOSGraph;
