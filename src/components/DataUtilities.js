import {
  calculateNu,
  calculateDelta,
  calculateEpsilon,
} from "./ComparisonMeasures";

var measureList = {
  nu: calculateNu,
  delta: calculateDelta,
  epsilon: calculateEpsilon,
};

// --------------------------------------------------
// Routines for calculating the comparison matrix
// --------------------------------------------------

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
            mat[elem][crystal][measure][c1] = {};
            allCodes.forEach((c2) => {
              if (c2 in processedData[elem][crystal]) {
                var value = measureList[measure](
                  processedData[elem][crystal][c1]["bm_fit_per_atom"],
                  processedData[elem][crystal][c2]["bm_fit_per_atom"]
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
