import { birchMurnaghan } from "matsci-parse";

// TODO: potential to move to matsci-parse (next to fitEos / birchMurnaghan):
// the Gauss-Legendre quadrature and the Δ, ε and ν comparisons of two
// equations of state are generic, not ACWF-specific. They would take
// matsci-parse's EosParameters ({ e0, v0, b0, b1 }); the ACWF field names
// (min_volume, bulk_modulus_ev_ang3, bulk_deriv) and the thresholds in
// variables.js stay here. Keep the 8-digit quadrature nodes/weights for
// results identical to the Python reference scripts.

/**
 * Gauss-Legendre quadrature to integrate a function.
 * 7 points means that the result is exact for a polynomial up to a degree of 13
 * @param {*} func
 * @param {*} x1
 * @param {*} x2
 * @returns
 */
function gaussian_quadrature_7pt(func, x1, x2) {
  // gauss legendre quadrature for 7 points
  let xs = [
    -0.94910791, -0.74153119, -0.40584515, 0.0, 0.40584515, 0.74153119,
    0.94910791,
  ];
  let ws = [
    0.12948497, 0.27970539, 0.38183005, 0.41795918, 0.38183005, 0.27970539,
    0.12948497,
  ];

  // take into account the change of interval from [x1, x2] to [-1, 1]
  let c1 = (x2 - x1) / 2;
  let c2 = (x1 + x2) / 2;

  let res = 0;
  for (let i = 0; i < xs.length; i++) {
    res += c1 * ws[i] * func(c1 * xs[i] + c2);
  }
  return res;
}

/**
 * Calculate the nu criterion
 *
 * The weights are a bit arbitrary...
 *
 * Multiply by 100 to convert to something related to [%]
 *
 * @param {*} bm_fit1
 * @param {*} bm_fit2
 * @returns
 */
export function calculateNu(bm_fit1, bm_fit2, _debug = false) {
  if (bm_fit1 == null || bm_fit2 == null) return NaN;
  var v0_1 = bm_fit1["min_volume"];
  var b0_1 = bm_fit1["bulk_modulus_ev_ang3"];
  var b1_1 = bm_fit1["bulk_deriv"];
  var v0_2 = bm_fit2["min_volume"];
  var b0_2 = bm_fit2["bulk_modulus_ev_ang3"];
  var b1_2 = bm_fit2["bulk_deriv"];

  var w = [1, 1 / 20, 1 / 400];

  var nu2 =
    ((w[0] * 2 * (v0_1 - v0_2)) / (v0_1 + v0_2)) ** 2 +
    ((w[1] * 2 * (b0_1 - b0_2)) / (b0_1 + b0_2)) ** 2 +
    ((w[2] * 2 * (b1_1 - b1_2)) / (b1_1 + b1_2)) ** 2;

  return 100 * Math.sqrt(nu2);
}

/**
 * Birch-Murnaghan energy at volume v of a fit, relative to its E0: the codes'
 * curves are compared with their minima aligned (as the Δ gauge does).
 */
export function birch_murnaghan(v, bm_fit) {
  return birchMurnaghan.energy(v, {
    e0: 0,
    v0: bm_fit["min_volume"],
    b0: bm_fit["bulk_modulus_ev_ang3"],
    b1: bm_fit["bulk_deriv"],
  });
}

/**
 * Calculate the "original delta criterion" by Stefaan Cottenier
 * using gaussian quadrature.
 *
 * Multiply by 1000 to convert to [meV]
 *
 * @param {*} bm_fit1
 * @param {*} bm_fit2
 * @returns
 */
export function calculateDelta(bm_fit1, bm_fit2, debug = false) {
  if (bm_fit1 == null || bm_fit2 == null) return NaN;

  // The integration interval is +-6% around the average min. volume,
  // as in the python implementation
  let v1 = (0.94 * (bm_fit1["min_volume"] + bm_fit2["min_volume"])) / 2;
  let v2 = (1.06 * (bm_fit1["min_volume"] + bm_fit2["min_volume"])) / 2;
  let integ = (v) => {
    return (birch_murnaghan(v, bm_fit1) - birch_murnaghan(v, bm_fit2)) ** 2;
  };
  let res = gaussian_quadrature_7pt(integ, v1, v2);
  let delta = 1000 * Math.sqrt(res / (v2 - v1));

  if (debug) console.log(bm_fit1, bm_fit2, delta);

  return delta;
}

/**
 * Calculate the "new delta" or "epsilon" criterion by Oleg Rubel
 * using gaussian quadrature.
 *
 * @param {*} bm_fit1
 * @param {*} bm_fit2
 * @returns
 */
export function calculateEpsilon(bm_fit1, bm_fit2, debug = false) {
  if (bm_fit1 == null || bm_fit2 == null) return NaN;

  if (debug) console.log(bm_fit1, bm_fit2);

  // The integration interval is +-6% around the average min. volume,
  // as in the python implementation
  let v1 = (0.94 * (bm_fit1["min_volume"] + bm_fit2["min_volume"])) / 2;
  let v2 = (1.06 * (bm_fit1["min_volume"] + bm_fit2["min_volume"])) / 2;
  let avg_e1 =
    (1 / (v2 - v1)) *
    gaussian_quadrature_7pt((v) => birch_murnaghan(v, bm_fit1), v1, v2);
  let avg_e2 =
    (1 / (v2 - v1)) *
    gaussian_quadrature_7pt((v) => birch_murnaghan(v, bm_fit2), v1, v2);

  let f1 = (v) =>
    (birch_murnaghan(v, bm_fit1) - birch_murnaghan(v, bm_fit2)) ** 2;
  let integ1 = gaussian_quadrature_7pt(f1, v1, v2);

  let f2 = (v) => (birch_murnaghan(v, bm_fit1) - avg_e1) ** 2;
  let integ2 = gaussian_quadrature_7pt(f2, v1, v2);

  let f3 = (v) => (birch_murnaghan(v, bm_fit2) - avg_e2) ** 2;
  let integ3 = gaussian_quadrature_7pt(f3, v1, v2);

  return Math.sqrt(integ1 / Math.sqrt(integ2 * integ3));
}
