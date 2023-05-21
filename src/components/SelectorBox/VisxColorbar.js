import { scaleLinear } from "@visx/scale";
import { AxisRight } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";

import { qualityThersh, colorScale } from "../../utils/variables";

const VisxColorbar = (props) => {
  const width = 20; // Width of the colorbar
  const height = 255; // Height of the colorbar

  var qts = qualityThersh[props.measure];

  const scaleMax = qts["outlier"] * 1.1;

  // Define the color scale
  const colScale = scaleLinear({
    range: [0, height],
    domain: [scaleMax, 0],
  });

  return (
    <svg width={58} height={275}>
      <LinearGradient id="colorbar-gradient">
        <stop
          offset={`${100 * (1 - qts["outlier"] / scaleMax)}%`}
          stopColor={colorScale["outlier"]}
        />
        <stop
          offset={`${100 * (1 - qts["outlier"] / scaleMax)}%`}
          stopColor={colorScale["bad"]}
        />
        <stop
          offset={`${100 * (1 - qts["good"] / scaleMax)}%`}
          stopColor={colorScale["good"]}
        />
        <stop
          offset={`${100 * (1 - qts["exc"] / scaleMax)}%`}
          stopColor={colorScale["exc"]}
        />
        <stop offset="100%" stopColor={colorScale["perfect"]} />
      </LinearGradient>
      <Group>
        {/* Render the gradient rect */}
        <rect
          x={0}
          y={10}
          width={width}
          height={height}
          fill="url(#colorbar-gradient)"
        />
        {/* Render the colorbar axis */}
        <AxisRight
          scale={colScale}
          left={width}
          top={10}
          //numTicks={numTicks}
          // hideTicks
          // hideAxisLine
          tickValues={[0.0, qts["exc"], qts["good"], qts["outlier"]]}
          tickLabelProps={(value, index) => ({
            fontSize: "0.9em",
            dy: "0.33em",
            dx: "0.33em",
          })}
          tickFormat={(value) => value.toFixed(2)}
        />
      </Group>
    </svg>
  );
};

export default VisxColorbar;
