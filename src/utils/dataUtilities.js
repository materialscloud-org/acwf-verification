import {
  calculateNu,
  calculateDelta,
  calculateEpsilon,
} from "./comparisonMeasures";

// --------------------------------------------------
// Routines for processing the initial data
// --------------------------------------------------

// from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
const colorList = [
  "#a6cee3",
  "#1f78b4",
  "#000000", // added black to match with AE reference
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#b15928",
  "#e8e81c", // modified to darker yellow
];

/**
 * Orderes codes such that AE are first and the rest are alphabetically after
 *
 * @param {*} processedData
 *
 * @returns ordered list
 */
export function genCodeOrderAndInfo(allData) {
  let allCodes = Object.keys(allData["metadata"]["methods"]);
  let aeCodes = [];
  let pseudoCodes = [];

  const allElectronKeywords = ["wien2k", "fleur", "all-electron"];

  const codeInfo = {};

  allCodes.forEach((code, i) => {
    let info = {
      ae: false,
      fontw: "normal",
      short_label: code,
    };

    if ("short_label" in allData["metadata"]["methods"][code])
      info["short_label"] = allData["metadata"]["methods"][code]["short_label"];

    if (allElectronKeywords.some((s) => code.toLowerCase().includes(s))) {
      aeCodes.push(code);
      info["ae"] = true;
      info["fontw"] = "600";
    } else {
      pseudoCodes.push(code);
    }
    codeInfo[code] = info;
  });

  // aeCodes.sort((a, b) =>
  //   a.localeCompare(b, undefined, { sensitivity: "base" })
  // );
  // pseudoCodes.sort((a, b) =>
  //   a.localeCompare(b, undefined, { sensitivity: "base" })
  // );
  aeCodes.sort();
  pseudoCodes.sort();

  const orderedCodes = aeCodes.concat(pseudoCodes);

  orderedCodes.forEach((code, i) => {
    codeInfo[code]["color"] = colorList[i];
  });

  return [orderedCodes, codeInfo];
}

// --------------------------------------------------
// Routines for calculating the comparison matrix
// --------------------------------------------------

var measureList = {
  nu: calculateNu,
  delta: calculateDelta,
  epsilon: calculateEpsilon,
};

/**
 * Calculates the comparison matrices
 *
 * @param {*} processedData
 *
 * @returns comparisonMatrix[element][crystalLabel][measure][code1][code2] = value
 */
export function calcComparisonMatrices(processedData, allCodes) {
  var mat = {};
  Object.keys(processedData).forEach((elem) => {
    mat[elem] = {};
    Object.keys(processedData[elem]).forEach((crystal) => {
      mat[elem][crystal] = {};
      Object.keys(measureList).forEach((measure) => {
        mat[elem][crystal][measure] = {};
        allCodes.forEach((c1) => {
          if (c1 in processedData[elem][crystal]) {
            if (processedData[elem][crystal][c1]["bm_fit_per_atom"] == null)
              return;
            mat[elem][crystal][measure][c1] = {};
            allCodes.forEach((c2) => {
              if (c2 in processedData[elem][crystal]) {
                if (processedData[elem][crystal][c2]["bm_fit_per_atom"] == null)
                  return;
                // debugging....
                // let debug =
                //   elem == "Sn" &&
                //   crystal == "X/Diamond" &&
                //   measure == "delta" &&
                //   c1 == "WIEN2k@(L)APW+lo+LO" &&
                //   c2 == "FLEUR@LAPW+LO";
                // if (debug) console.log(c1, c2);
                let debug = false;

                var value = measureList[measure](
                  processedData[elem][crystal][c1]["bm_fit_per_atom"],
                  processedData[elem][crystal][c2]["bm_fit_per_atom"],
                  debug
                );
                mat[elem][crystal][measure][c1][c2] = value;
              }
            });
          }
        });
      });
    });
  });

  return mat;
}

/**
 * Calculate the maximum value of the matrices of different crystals
 * based on the selected measure and codes
 * This is used to set a consistent color scale.
 * @param {*} matrix
 * @param {*} measure
 * @param {*} selectedCodes
 */
export function calcMatrixMax(matrix, elem, measure, selectedCodes) {
  var max = -Number.MAX_SAFE_INTEGER;
  Object.keys(matrix[elem]).forEach((crystal) => {
    Object.keys(matrix[elem][crystal][measure]).forEach((c1) => {
      if (!selectedCodes.has(c1)) return;
      Object.keys(matrix[elem][crystal][measure][c1]).forEach((c2) => {
        if (!selectedCodes.has(c2)) return;
        if (matrix[elem][crystal][measure][c1][c2] > max)
          max = matrix[elem][crystal][measure][c1][c2];
      });
    });
  });
  return max;
}
