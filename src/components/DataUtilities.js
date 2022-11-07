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

// from https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
const colorList = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#b15928",
  "#ffff99",
];

/**
 * Return the number of atoms per formula unit.
 *
 * For unaries, it's the number in the primitive cell: 1 for SC, BCC, FCC; 2 for diamond.
 *
 * @param {string} crystalType
 * @returns {int} number of atoms in the formula unit
 */
function getNumAtomsInFormulaUnit(crystalType) {
  var mapping = {
    XO: 2,
    XO2: 3,
    X2O: 3,
    X2O3: 5,
    XO3: 4,
    X2O5: 7,
    "X/Diamond": 2,
    "X/SC": 1,
    "X/FCC": 1,
    "X/BCC": 1,
  };
  return mapping[crystalType];
}

/**
 * Return the scaling factor for extensive quantities (energies, volumes, ...)
 * The volume per formula unit is the volume in the simulation cell (with `num_atoms_in_cell`)
 * DIVIDED by the value returned by this function.
 * @param {int} numAtomsInCell
 * @param {string} crystalType
 * @returns
 */
function getVolumeScalingToFormulaUnit(numAtomsInCell, crystalType) {
  let numAtomsInFormulaUnit = getNumAtomsInFormulaUnit(crystalType);
  return numAtomsInCell / numAtomsInFormulaUnit;
}

export function scaleEosPerFormulaUnit(EosData, numAtomsInCell, crystalType) {
  let factor = getVolumeScalingToFormulaUnit(numAtomsInCell, crystalType);
  return EosData.map((elem) => {
    return [elem[0] / factor, elem[1] / factor];
  });
}

export function scaleBMFitPerFormulaUnit(bmFit, numAtomsInCell, crystalType) {
  let factor = getVolumeScalingToFormulaUnit(numAtomsInCell, crystalType);
  var bmFitScaled = {
    E0: bmFit["E0"] / factor,
    bulk_deriv: bmFit["bulk_deriv"],
    bulk_modulus_ev_ang3: bmFit["bulk_modulus_ev_ang3"],
    min_volume: bmFit["min_volume"] / factor,
    residuals: bmFit["residuals"],
  };
  return bmFitScaled;
}

// --------------------------------------------------
// Processing the raw data
// --------------------------------------------------

// each element should have 6 oxide and 4 unaries structures, define them here
// some code might be missing some of them
const crystalTypes = {
  oxides: ["X2O", "X2O3", "X2O5", "XO", "XO2", "XO3"],
  unaries: ["X/BCC", "X/Diamond", "X/FCC", "X/SC"],
};

function checkDataOk(rawData, code, type, crystal) {
  if (!(code in rawData)) return false;
  var codeData = rawData[code];
  if (codeData == null) return false;
  if (codeData[type] == null) return false;
  if (codeData[type]["eos_data"] == null) return false;
  if (codeData[type]["eos_data"][crystal] == null) return false;
  if (codeData[type]["BM_fit_data"] == null) return false;
  if (codeData[type]["BM_fit_data"][crystal] == null) return false;
  return true;
}

function processCrystalData(rawData, crystal, allCodes, type) {
  var crystalData = {};

  for (const [i, code] of allCodes.entries()) {
    if (!checkDataOk(rawData, code, type, crystal)) {
      console.log(`Data problem for ${code} ${crystal}`);
      continue;
    }

    let numAtomsInSimCell =
      rawData[code][type]["num_atoms_in_sim_cell"][crystal];
    let eosData = rawData[code][type]["eos_data"][crystal];
    let bmFit = rawData[code][type]["BM_fit_data"][crystal];
    let crystalType = crystal.split("-")[1];

    crystalData[code] = {
      color: colorList[i % colorList.length],
      eos_data_scaled: scaleEosPerFormulaUnit(
        eosData,
        numAtomsInSimCell,
        crystalType
      ),
      bm_fit_scaled: scaleBMFitPerFormulaUnit(
        bmFit,
        numAtomsInSimCell,
        crystalType
      ),
    };
  }
  return crystalData;
}

/**
 * Function that processes all the raw data for the selected element
 * into a format that can be nicely handled later
 *
 * @returns processedData[element-crystalLabel][code] = {color, eos_data_scaled, bm_fit_scaled}
 */
export function processData(rawData, allCodes, element) {
  var processedData = {};
  Object.keys(crystalTypes).map((type) => {
    crystalTypes[type].map((crystalLabel) => {
      var crystal = element + "-" + crystalLabel;
      processedData[crystal] = processCrystalData(
        rawData,
        crystal,
        allCodes,
        type
      );
    });
  });
  return processedData;
}

// --------------------------------------------------
// Routines for calculating the comparison matrix
// --------------------------------------------------

/**
 * Calculates the comparison matrices
 *
 * @param {*} processedData
 * @param {*} allCodes
 *
 * @returns comparisonMatrix[element-crystalLabel][measure][code1][code2] = value
 */
export function calcComparisonMatrices(processedData) {
  var mat = {};
  console.log(processedData);
  Object.keys(processedData).forEach((crystal) => {
    mat[crystal] = {};
    Object.keys(measureList).forEach((measure) => {
      mat[crystal][measure] = {};
      Object.keys(processedData[crystal]).forEach((c1, i1) => {
        mat[crystal][measure][c1] = {};
        Object.keys(processedData[crystal]).forEach((c2, i2) => {
          var value =
            100 *
            measureList[measure](
              processedData[crystal][c1]["bm_fit_scaled"],
              processedData[crystal][c2]["bm_fit_scaled"]
            );
          mat[crystal][measure][c1][c2] = value;
        });
      });
    });
  });

  return mat;
}

/**
 * Calculate the maximum value of the matrices of different crystals
 * based on the selected measure and codes
 * This will be used to set a consistent color scale.
 * @param {*} matrix
 * @param {*} measure
 * @param {*} selectedCodes
 */
export function calcMatrixMax(matrix, measure, selectedCodes) {
  var max = -Number.MAX_SAFE_INTEGER;
  Object.keys(matrix).forEach((crystal) => {
    Object.keys(matrix[crystal][measure]).forEach((c1) => {
      if (!selectedCodes.has(c1)) return;
      Object.keys(matrix[crystal][measure][c1]).forEach((c2) => {
        if (!selectedCodes.has(c2)) return;
        if (matrix[crystal][measure][c1][c2] > max)
          max = matrix[crystal][measure][c1][c2];
      });
    });
  });
  return max;
}
