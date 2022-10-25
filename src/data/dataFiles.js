import oxides_abinit from "./results-oxides-verification-PBE-v1-abinit.json";
import oxides_ae from "./results-oxides-verification-PBE-v1-ae.json";
import oxides_bigdft from "./results-oxides-verification-PBE-v1-bigdft.json";
import oxides_castep from "./results-oxides-verification-PBE-v1-castep.json";
import oxides_cp2k from "./results-oxides-verification-PBE-v1-cp2k.json";
import oxides_fleur from "./results-oxides-verification-PBE-v1-fleur.json";
import oxides_gpaw from "./results-oxides-verification-PBE-v1-gpaw.json";
import oxides_qe from "./results-oxides-verification-PBE-v1-quantum_espresso.json";
import oxides_siesta from "./results-oxides-verification-PBE-v1-siesta.json";
import oxides_vasp from "./results-oxides-verification-PBE-v1-vasp.json";
import oxides_wien2k from "./results-oxides-verification-PBE-v1-wien2k.json";

import unaries_abinit from "./results-unaries-verification-PBE-v1-abinit.json";
import unaries_ae from "./results-unaries-verification-PBE-v1-ae.json";
import unaries_bigdft from "./results-unaries-verification-PBE-v1-bigdft.json";
import unaries_castep from "./results-unaries-verification-PBE-v1-castep.json";
import unaries_cp2k from "./results-unaries-verification-PBE-v1-cp2k.json";
import unaries_fleur from "./results-unaries-verification-PBE-v1-fleur.json";
import unaries_gpaw from "./results-unaries-verification-PBE-v1-gpaw.json";
import unaries_qe from "./results-unaries-verification-PBE-v1-quantum_espresso.json";
import unaries_siesta from "./results-unaries-verification-PBE-v1-siesta.json";
import unaries_vasp from "./results-unaries-verification-PBE-v1-vasp.json";
import unaries_wien2k from "./results-unaries-verification-PBE-v1-wien2k.json";

export default {
  "oxides-verification-PBE-v1": {
    abinit: oxides_abinit,
    cp2k: oxides_cp2k,
  },
  "unaries-verification-PBE-v1": {
    abinit: unaries_abinit,
    ae: unaries_ae,
    bigdft: unaries_bigdft,
  },
};
