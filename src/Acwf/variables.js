// These are used in
// * here, in the About section
// * in the metric selection help toolbar
// * when determining heatmap colors
// * in the colorbar
export const qualityThersh = {
  nu: { exc: 0.1, good: 0.33, outlier: 1.65 },
  epsilon: { exc: 0.06, good: 0.2, outlier: 1.0 },
  delta: { exc: 0.3, good: 0.95, outlier: 5.0 },
};

export const colorScale = {
  perfect: "#0000be",
  exc: "#3a50de",
  good: "#ffff55",
  bad: "#f53216",
  outlier: "#bf0000",
};
