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
  for (let v = v_min; v < v_max; v += 0.2) {
    bm_arr.push({ v: v, bm: birch_murnaghan(v, bm_fit) });
  }
  return bm_arr;
}

function range(start, stop, step = 1) {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

const RenderDot = ({ cx, cy }) => {
  return <Dot cx={cx} cy={cy} fill="black" r={3} />;
};

class EOSGraph extends React.Component {
  constructor(props) {
    super(props);

    this.eos_arr = this.props.eos_data.map((x) => ({
      v: x[0],
      eos: x[1] - this.props.bm_fit["E0"],
    }));
    this.v_min = Math.min(...this.eos_arr.map((x) => x["v"])) - 0.2;
    this.v_max = Math.max(...this.eos_arr.map((x) => x["v"])) + 0.2;
    this.bm_arr = birch_murnaghan_array(
      this.v_min,
      this.v_max,
      this.props.bm_fit
    );

    // the chart data needs to be in a single array
    this.chart_data = this.eos_arr.slice();
    this.chart_data.push(...this.bm_arr);

    // calculate tick positions
    this.xticks = range(Math.ceil(this.v_min), Math.floor(this.v_max) + 1);
    this.e_max = Math.max(...this.bm_arr.map((x) => x["bm"])) + 0.005;
    this.yticks = range(0.0, this.e_max, 0.01);
  }

  render() {
    return (
      <ComposedChart
        width={400}
        height={300}
        data={this.chart_data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="v"
          type="number"
          domain={[this.v_min, this.v_max]}
          tickFormatter={(value) => value.toFixed(1)}
          // allowDuplicatedCategory={false}
          ticks={this.xticks}
        />
        <YAxis
          type="number"
          domain={[-0.004, this.e_max]}
          tickFormatter={(value) => value.toFixed(2)}
          ticks={this.yticks}
        />
        <Tooltip
          formatter={(value) => value.toFixed(4)}
          labelFormatter={(value) => value.toFixed(2)}
        />
        <Legend />
        <Line
          dataKey="bm"
          dot={false}
          activeDot={false}
          stroke="#8884d8"
          name="BM fit"
        />
        <Scatter
          name="calculation"
          dataKey="eos"
          stroke="#000000"
          shape={<RenderDot />}
        />
      </ComposedChart>
    );
  }
}

export default EOSGraph;
