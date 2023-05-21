import React, { version } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { HeatmapRect } from "@visx/heatmap";
import { AxisLeft, AxisBottom } from "@visx/axis";

import { qualityThersh, colorScale } from "../../utils/variables";

import "./HeatMap.css";

const hot1 = "#77312f";
const hot2 = "#f33d15";
const cool1 = "#122549";
const cool2 = "#b4fbde";
export const background = "#28272c";

const width = 440;
const height = 400;

const margin = { top: 10, left: 140, right: 10, bottom: 105 };

function prepMatrix(inpMatrix, selectedCodes) {
  var outMatrix = [];
  var codeList = [];
  let matCodes = Object.keys(inpMatrix);
  let matCodesRev = matCodes.slice().reverse();
  // Reverse vertical axis, such that top-left is 0, 0 point
  matCodes.forEach((c1, i1) => {
    if (!selectedCodes.has(c1)) return;
    codeList.push(c1);
    var el = { bin: { i1 }, bins: [] };
    matCodesRev.forEach((c2, i2) => {
      if (!selectedCodes.has(c2)) return;
      el["bins"].push({
        count: inpMatrix[c1][c2],
      });
    });
    outMatrix.push(el);
  });
  return [outMatrix, codeList];
}

class HeatMap extends React.Component {
  constructor(props) {
    super(props);
  }

  tickFormatY = (v, index, ticks) => {
    let codeFormat =
      this.props.codeFormatting[this.codeList.slice().reverse()[index]];
    return {
      name: codeFormat["short_label"],
      color: codeFormat["color"],
      fontw: codeFormat["fontw"],
    };
  };

  tickFormatX = (v, index, ticks) => {
    let codeFormat = this.props.codeFormatting[this.codeList[index]];
    return codeFormat["short_label"];
  };

  render() {
    var [dataMatrix, cl] = prepMatrix(
      this.props.matrix,
      this.props.selectedCodes
    );
    this.codeList = cl;

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.bottom - margin.top;

    const xScale = scaleLinear({
      domain: [0, dataMatrix.length],
    });
    const yScale = scaleLinear({
      domain: [0, dataMatrix.length],
    });
    const rectColorScale = scaleLinear({
      //range: ["#0cd80c", "#a4f8a4", "white", "red"],
      range: [
        colorScale["perfect"],
        colorScale["exc"],
        colorScale["good"],
        colorScale["bad"],
        colorScale["outlier"],
        colorScale["outlier"],
      ],
      domain: [
        0,
        qualityThersh[this.props.measure]["exc"],
        qualityThersh[this.props.measure]["good"],
        qualityThersh[this.props.measure]["outlier"],
        qualityThersh[this.props.measure]["outlier"] + 0.001,
        qualityThersh[this.props.measure]["outlier"] + 10000,
      ],
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
                heatmapBins.map((bin) => {
                  let color = bin.color;
                  let value_text = bin.count.toFixed(1);
                  // increase precision if less codes are selected
                  if (dataMatrix.length < 8) {
                    value_text = bin.count.toFixed(2);
                  }
                  if (dataMatrix.length < 6) {
                    value_text = bin.count.toFixed(3);
                  }
                  if (dataMatrix.length < 4) {
                    value_text = bin.count.toFixed(4);
                  }
                  // disable diagonal elements
                  if (bin.row == dataMatrix.length - bin.column - 1) {
                    color = "#f0f0f0";
                    value_text = "";
                  }
                  return (
                    <g key={`heatmap-rect-${bin.row}-${bin.column}`}>
                      <rect
                        className="visx-heatmap-rect"
                        width={bin.width}
                        height={bin.height}
                        x={bin.x}
                        y={bin.y - binHeight}
                        fill={color}
                      />
                      <text
                        x={bin.x + binWidth / 2}
                        y={bin.y - binHeight / 2}
                        fontSize="12"
                        fill={
                          bin.count < qualityThersh[this.props.measure]["exc"]
                            ? "#e6e6e6"
                            : "black"
                        }
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {value_text}
                      </text>
                    </g>
                  );
                })
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
            tickLabelProps={(val, index) => ({
              angle: -45,
              textAnchor: "end",
              scaleToFit: "shrink-only",
              fontSize: 12,
              fontWeight:
                this.props.codeFormatting[this.codeList[index]]["fontw"],
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
                  x={x - 125}
                  y={y - 5}
                  width={10}
                  height={10}
                  fill={formattedValue.color}
                />
                <text
                  x={x - 110} // or 4 & textAnchor={"end"}
                  y={y + 1}
                  fontSize={12}
                  fontWeight={formattedValue.fontw}
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
