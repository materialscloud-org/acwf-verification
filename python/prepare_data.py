#!/usr/bin/env python
"""
Reads the source ACWF verification files and prepare a single JSON file that contains all the
relevant data and will be included in the application (as opposed to queried directly).

The source files are listed in the `labels.json` file and contain the following keys:

[
    BM_fit_data, completely_off, eos_data, failed_wfs, missing_outputs,
    num_atoms_in_sim_cell, script_version, set_name, stress_data, uuid_mapping
]

This current script will process these files into a single json with the format of
{
    metadata : {
        date : <date>,
        <methods-type>: { <code> : {
            oxides : {filename: <x>, md5: <x>},
            unaries : {filename: <x>, md5: <x>},
            short_label : <x>
        }}
    }
    data : {
        <element> : { <crystalType (X2O, X2O3, X/BCC, ...)> : { <code> : {
            eos_data_per_atom: <x>,
            bm_fit_per_atom: <x>
        }}}
    }
}

where in `eos_data_per_atom` and `bm_fit_per_atom` the energy and volume are scaled to per atom.
If "per formula unit" is needed, just multiply accordingly.

The <methods-type> is one of
* methods-ae (all-electron, from the main paper);
* methods-pp-main (pseudopotential, from the main paper);
* methods-pp-contrib (pseudopotential, contributed after the main paper).
"""

import collections
import hashlib
import json
from datetime import datetime

import requests

DATA_FOLDER_URL = "https://raw.githubusercontent.com/aiidateam/acwf-verification-scripts/main/acwf_paper_plots/code-data/"
LABELS_FILE = DATA_FOLDER_URL + "/labels.json"

# Collect the all electrons methods under these keys.
# The remaining ones in "methods-main" will be the pseudopotential-main
ALL_ELECTRON_METHODS = ["all-electron average", "FLEUR@LAPW+LO", "WIEN2k@(L)APW+lo+LO"]

# The contributed methods are added to the "methods-supplementary" key in the original file,
# together with datasets that are not published. Therefore we need an explicit list on what to pick.
CONTRIBUTED_METHODS = ["ABACUS@PW|PseudoDojo-v0.4", "DFTK@PW|PseudoDojo-v0.5"]


def nested_dict():
    return collections.defaultdict(nested_dict)


def scale_bm_fit(bm_fit, num_atoms_in_cell):
    """Scale BM fit such that it is "per atom" """
    res = {
        "E0": bm_fit["E0"] / num_atoms_in_cell,
        "bulk_deriv": bm_fit["bulk_deriv"],
        "bulk_modulus_ev_ang3": bm_fit["bulk_modulus_ev_ang3"],
        "min_volume": bm_fit["min_volume"] / num_atoms_in_cell,
        "residuals": bm_fit["residuals"],
    }
    return res


def scale_eos_data(eos_data, num_atoms_in_cell):
    """Scale eos_data such that it is "per atom" """
    return [[x[0] / num_atoms_in_cell, x[1] / num_atoms_in_cell] for x in eos_data]


def process_json(source_json, collect_data, code):
    """Process the source json file into the specified format and populate collect_data

    contains the data for a specific <code> and <oxides/unaries>

    The BM fit and EOS data is scaled to be "per atom".
    """

    # Process BM fit

    for elem_crystal in source_json["BM_fit_data"]:
        elem, crystal_type = elem_crystal.split("-")
        bm_fit = source_json["BM_fit_data"][elem_crystal]
        num_atoms_in_sim_cell = source_json["num_atoms_in_sim_cell"][elem_crystal]

        if bm_fit is None:
            print(f"  {code} BM_fit_data {elem_crystal} is None, skipping.")
            continue

        collect_data[elem][crystal_type][code]["bm_fit_per_atom"] = scale_bm_fit(
            bm_fit, num_atoms_in_sim_cell
        )

    # Process EOS data
    if "eos_data" in source_json:
        for elem_crystal in source_json["eos_data"]:
            elem, crystal_type = elem_crystal.split("-")
            eos_data = source_json["eos_data"][elem_crystal]
            num_atoms_in_sim_cell = source_json["num_atoms_in_sim_cell"][elem_crystal]

            if eos_data is None:
                print(f"  {code} eos_data {elem_crystal} is None, skipping.")
                continue

            collect_data[elem][crystal_type][code]["eos_data_per_atom"] = (
                scale_eos_data(eos_data, num_atoms_in_sim_cell)
            )


def process_entry(key, entry, collected_data):
    meta = nested_dict()

    meta["short_label"] = entry.get("short_label")
    if key == "all-electron average":
        meta["short_label"] = "AE average"

    for crystal_type in ["unaries", "oxides"]:
        fname = entry[crystal_type]

        print(f"Loading {fname}")

        r = requests.get(DATA_FOLDER_URL + fname)
        md5 = hashlib.md5(r.content).hexdigest()
        meta[crystal_type]["filename"] = fname
        meta[crystal_type]["md5"] = md5

        process_json(r.json(), collected_data, key)

    return meta


if __name__ == "__main__":
    r = requests.get(LABELS_FILE)
    labels_json = r.json()

    collected_meta = {
        "date": datetime.today().strftime("%Y-%m-%d"),
        "methods-ae": {},
        "methods-pp-main": {},
        "methods-pp-contrib": {},
    }
    collected_data = nested_dict()

    # Parse the main paper methods
    for key, entry in (labels_json["references"] | labels_json["methods-main"]).items():
        meta = process_entry(key, entry, collected_data)
        if key in ALL_ELECTRON_METHODS:
            collected_meta["methods-ae"][key] = meta
        else:
            collected_meta["methods-pp-main"][key] = meta

    # For the contributed methods, parse only the explicitly selected ones.
    for key, entry in labels_json["methods-supplementary"].items():
        if key in CONTRIBUTED_METHODS:
            meta = process_entry(key, entry, collected_data)
            collected_meta["methods-pp-contrib"][key] = meta

    final_data = {"metadata": collected_meta, "data": collected_data}

    fname = "data.json"
    with open(fname, "w") as f:
        json.dump(final_data, f, indent=2)

        print(f"Wrote {fname}!")
