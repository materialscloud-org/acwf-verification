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
