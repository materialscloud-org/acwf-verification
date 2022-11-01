import React, { version } from "react";
import { Group } from "@visx/group";
import genBins, { Bin, Bins } from "@visx/mock-data/lib/generators/genBins";
import { scaleLinear } from "@visx/scale";
import { HeatmapRect } from "@visx/heatmap";
import { getSeededRandom } from "@visx/mock-data";
import { AxisLeft, AxisBottom } from "@visx/axis";

import "./HeatMap.css";

const hot1 = "#77312f";
const hot2 = "#f33d15";
const cool1 = "#122549";
const cool2 = "#b4fbde";
export const background = "#28272c";

const width = 450;
const height = 400;

const margin = { top: 10, left: 135, right: 10, bottom: 100 };

function calculateNu(bm_fit1, bm_fit2) {
  if (bm_fit1 == null || bm_fit2 == null) return -1.0;
  var v0_1 = bm_fit1["min_volume"];
  var b0_1 = bm_fit1["bulk_modulus_ev_ang3"];
  var b01_1 = bm_fit1["bulk_deriv"];
  var v0_2 = bm_fit2["min_volume"];
  var b0_2 = bm_fit2["bulk_modulus_ev_ang3"];
  var b01_2 = bm_fit2["bulk_deriv"];

  var w = [1, 1 / 8, 1 / 64];

  var nu2 =
    ((w[0] * 2 * (v0_1 - v0_2)) / (v0_1 + v0_2)) ** 2 +
    ((w[1] * 2 * (b0_1 - b0_2)) / (b0_1 + b0_2)) ** 2 +
    ((w[2] * 2 * (b01_1 - b01_2)) / (b01_1 + b01_2)) ** 2;

  return 1000 * Math.sqrt(nu2);
}

function calculateMatrix(inputData, codeList) {
  var difmatrix = [];
  codeList.forEach((c1, i1) => {
    var el = { bin: { i1 }, bins: [] };
    codeList.forEach((c2, i2) => {
      el["bins"].push({
        count: calculateNu(inputData[c1]["bm_fit"], inputData[c2]["bm_fit"]),
      });
    });
    difmatrix.push(el);
  });
  return difmatrix;
}

class HeatMap extends React.Component {
  constructor(props) {
    super(props);
    // this.props.inputData[code] = { color, eos_data, bm_fit }
    this.codeList = Object.keys(this.props.inputData);
  }

  tickFormatY = (v, index, ticks) => ({
    name: this.codeList[index],
    color: this.props.inputData[this.codeList[index]]["color"],
  });

  tickFormatX = (v, index, ticks) => this.codeList[index];

  render() {
    this.codeList = Object.keys(this.props.inputData);

    var dataMatrix = calculateMatrix(this.props.inputData, this.codeList);

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.bottom - margin.top;

    const xScale = scaleLinear({
      domain: [0, dataMatrix.length],
    });
    const yScale = scaleLinear({
      domain: [0, dataMatrix.length],
    });
    const rectColorScale = scaleLinear({
      range: ["white", hot2],
      domain: [0, 1.0],
    });

    xScale.range([0, xMax]);
    yScale.range([yMax, 0]);

    const binWidth = xMax / dataMatrix.length;
    const binHeight = yMax / dataMatrix.length;

    var tickValues = [];
    for (let i = 0; i < dataMatrix.length; i++) {
      tickValues.push(i + 0.5);
    }

    return (
      <svg width={width} height={height}>
        <Group top={margin.top} bottom={margin.bottom} left={margin.left}>
          <HeatmapRect
            data={dataMatrix}
            xScale={xScale}
            yScale={yScale}
            colorScale={rectColorScale}
            binWidth={binWidth}
            binHeight={binHeight}
            gap={1}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => (
                  <g key={`heatmap-rect-${bin.row}-${bin.column}`}>
                    <rect
                      className="visx-heatmap-rect"
                      width={bin.width}
                      height={bin.height}
                      x={bin.x}
                      y={bin.y - binHeight}
                      fill={bin.color}
                    />
                    <text
                      x={bin.x + binWidth / 2}
                      y={bin.y - binHeight / 2}
                      fontSize="12"
                      fill="black"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {bin.count.toFixed(1)}
                    </text>
                  </g>
                ))
              )
            }
          </HeatmapRect>
          <AxisBottom
            scale={xScale}
            top={yMax}
            stroke={"#1b1a1e"}
            tickTextFill={"#1b1a1e"}
            tickValues={tickValues}
            tickFormat={this.tickFormatX}
            tickLabelProps={() => ({
              angle: -45,
              textAnchor: "end",
              scaleToFit: "shrink-only",
              fontSize: 12,
            })}
          />
          <AxisLeft
            scale={yScale}
            top={0}
            left={0}
            stroke={"#1b1a1e"}
            tickTextFill={"#1b1a1e"}
            tickValues={tickValues}
            tickFormat={this.tickFormatY}
            tickComponent={({ x, y, formattedValue }) => (
              <g>
                <rect
                  x={x - 120}
                  y={y - 5}
                  width={10}
                  height={10}
                  fill={formattedValue.color}
                />
                <text
                  x={x - 103} // or 4 & textAnchor={"end"}
                  y={y}
                  fontSize={12}
                  textAnchor={"start"}
                  dominantBaseline={"middle"}
                >
                  {formattedValue.name}
                </text>
              </g>
            )}
          />
        </Group>
      </svg>
    );
  }
}

export default HeatMap;
