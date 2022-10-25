import React from "react";
import { Group } from "@visx/group";
import genBins, { Bin, Bins } from "@visx/mock-data/lib/generators/genBins";
import { scaleLinear } from "@visx/scale";
import { HeatmapRect } from "@visx/heatmap";
import { getSeededRandom } from "@visx/mock-data";
import { AxisLeft, AxisBottom } from "@visx/axis";

const hot1 = "#77312f";
const hot2 = "#f33d15";
const cool1 = "#122549";
const cool2 = "#b4fbde";
export const background = "#28272c";

const width = 400;
const height = 400;

const seededRandom = getSeededRandom(0.41);

const tickFormat = (v, index, ticks) => "quantum espresso";

const binData = genBins(
  /* length = */ 8,
  /* height = */ 8,
  /** binFunc */ (idx) => 150 * idx,
  /** countFunc */ (i, number) => 25 * seededRandom()
);

function max(data, value) {
  return Math.max(...data.map(value));
}

function min(data, value) {
  return Math.min(...data.map(value));
}

// accessors
const bins = (d) => d.bins;
const count = (d) => d.count;

const colorMax = max(binData, (d) => max(bins(d), count));
const bucketSizeMax = max(binData, (d) => bins(d).length);

// scales
const xScale = scaleLinear({
  domain: [0, binData.length],
});
const yScale = scaleLinear({
  domain: [0, bucketSizeMax],
});
const rectColorScale = scaleLinear({
  range: [cool2, hot2],
  domain: [0, colorMax],
});

const margin = { top: 30, left: 110, right: 30, bottom: 110 };

const Example = () => {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.bottom - margin.top;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  const binWidth = xMax / binData.length;
  const binHeight = yMax / bucketSizeMax;

  console.log(binData);

  return (
    <svg width={width} height={height}>
      <Group top={margin.top} bottom={margin.bottom} left={margin.left}>
        <HeatmapRect
          data={binData}
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
          tickValues={[0.5, 1.5, 2.5]}
          tickFormat={tickFormat}
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
          tickValues={[0.5, 1.5, 2.5]}
          tickFormat={tickFormat}
          tickLabelProps={() => ({
            textAnchor: "end",
            scaleToFit: "shrink-only",
            fontSize: 12,
          })}
        />
      </Group>
    </svg>
  );
};

export default Example;
