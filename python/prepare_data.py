"""
Read the source ACWF verification files and prepare a single JSON file that contains all the
relevant data and will be included in the application (as opposed to queried directly).

The source files are named

    results-<oxides/unaries>-verification-PBE-v1-<code>.json

and the json data contains the following keys:

[
    BM_fit_data, completely_off, eos_data, failed_wfs, missing_outputs,
    num_atoms_in_sim_cell, script_version, set_name, stress_data, uuid_mapping
]

This current script will process these files into a single json with the format of
{
    metadata : {date : <date>, source_files_md5 : [<filename> : <md5>]}
    data : {
        <element> : { <crystalType (X2O, X2O3, X/BCC, ...)> : { <code> : {
            eos_data_per_atom: <x>,
            bm_fit_per_atom: <x>
        }}}
    }
}

where in `eos_data_per_atom` and `bm_fit_per_atom` the energy and volume are scaled to per atom.
If "per formula unit" is needed, just multiply accordingly.
"""

import requests
import os
from datetime import datetime
import hashlib
import json


# 1. get a list of all files in the acwf-verification-scripts repo
url_file_list = 'https://api.github.com/repos/aiidateam/acwf-verification-scripts/git/trees/main?recursive=1'
files_json = requests.get(url_file_list).json()

# 2. go through the list of files, if they're a json in the data_folder,
# load it from raw.githubusercontent.com

url_root = "https://raw.githubusercontent.com/aiidateam/acwf-verification-scripts/main/"
data_folder = "extra_scripts/final_boxplot_all_codes/data/"
skip_codes = ["ae"]

def scale_bm_fit(bm_fit, num_atoms_in_cell):
    """Scale BM fit such that it is "per atom"
    """
    res = {
        "E0": bm_fit["E0"] / num_atoms_in_cell,
        "bulk_deriv": bm_fit["bulk_deriv"],
        "bulk_modulus_ev_ang3": bm_fit["bulk_modulus_ev_ang3"],
        "min_volume": bm_fit["min_volume"] / num_atoms_in_cell,
        "residuals": bm_fit["residuals"],
    }
    return res

def scale_eos_data(eos_data, num_atoms_in_cell):
    """Scale eos_data such that it is "per atom"
    """
    return [[x[0]/num_atoms_in_cell, x[1]/num_atoms_in_cell] for x in eos_data]

def process_json(source_json, current_data, code):
    """ Process the source json file into the specified format and populate current_data
    
    contains the data for a specific <code> and <oxides/unaries>
    
    The BM fit and EOS data is scaled to be "per atom".
    """
    
    # Process BM fit
    
    for elem_crystal in source_json["BM_fit_data"]:
        elem, crystal_type = elem_crystal.split("-")
        bm_fit = source_json["BM_fit_data"][elem_crystal]
        num_atoms_in_sim_cell = source_json["num_atoms_in_sim_cell"][elem_crystal]
        
        if bm_fit == None:
            print(f"{code} BM_fit_data {elem_crystal} is None, skipping.")
            continue
        
        if elem not in current_data:
            current_data[elem] = {}
        if crystal_type not in current_data[elem]:
            current_data[elem][crystal_type] = {}
        if code not in current_data[elem][crystal_type]:
            current_data[elem][crystal_type][code] = {}
        
        current_data[elem][crystal_type][code]["bm_fit_per_atom"] = scale_bm_fit(bm_fit, num_atoms_in_sim_cell)
    
    # Process EOS data
    
    for elem_crystal in source_json["eos_data"]:
        elem, crystal_type = elem_crystal.split("-")
        eos_data = source_json["eos_data"][elem_crystal]
        num_atoms_in_sim_cell = source_json["num_atoms_in_sim_cell"][elem_crystal]
        
        if eos_data == None:
            print(f"{code} eos_data {elem_crystal} is None, skipping.")
            continue
            
        if elem not in current_data:
            current_data[elem] = {}
        if crystal_type not in current_data[elem]:
            current_data[elem][crystal_type] = {}
        if code not in current_data[elem][crystal_type]:
            current_data[elem][crystal_type][code] = {}
        
        current_data[elem][crystal_type][code]["eos_data_per_atom"] = scale_eos_data(eos_data, num_atoms_in_sim_cell)

meta = {"date": datetime.today().strftime('%Y-%m-%d'), "source_files_md5": {}}
data = {}

for fileobj in files_json['tree']:
    
    path = fileobj["path"]
    if path.startswith(data_folder) and path.endswith(".json"):
        # example name: results-oxides-verification-PBE-v1-abinit.json
        name = os.path.basename(path)
        name_split = os.path.splitext(name)[0].split("-")
        crystal_type = name_split[1]
        code = name_split[5]
        
        if code in skip_codes:
            continue
            
        # load the json file
        r = requests.get(url_root + path)
        md5 = hashlib.md5(r.content).hexdigest()
        meta["source_files_md5"][name] = md5
        
        process_json(r.json(), data, code)

#all_elements = [
#    "H",  "He", "Li", "Be", "B",  "C",  "N",  "O",  "F",  "Ne", "Na", "Mg", "Al", "Si", "P",
#    "S",  "Cl", "Ar", "K",  "Ca", "Sc", "Ti", "V",  "Cr", "Mn", "Fe", "Co", "Ni", "Cu", 
#    "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y",  "Zr", "Nb", "Mo", "Tc", "Ru",
#    "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I",  "Xe", "Cs", "Ba", "La", "Ce",
#    "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf",
#    "Ta", "W",  "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn",
#    "Fr", "Ra", "Ac", "Th", "Pa", "U",  "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
#    "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh",
#    "Fl", "Mc", "Lv", "Ts", "Og"
#]

def set_float_precision(o, ndig=8):
    """
    Rounds the floating point values to specified number of significant digits
    """
    if isinstance(o, float):return float(f'{o:.{ndig}g}')
    if isinstance(o, dict): return {k: set_float_precision(v, ndig) for k, v in o.items()}
    if isinstance(o, (list, tuple)): return [set_float_precision(x, ndig) for x in o]
    return o

# set_float_precision can reduce the file size (e.g. 3.8 MB -> 2.7 MB)
# but e.g. in energy differences (large values are subtracted), every significant digit can be important.
# use the full precision, for now.

final_data = {
    "metadata": meta,
    "data": data, # source precision
    #"data": set_float_precision(data, ndig=8),
}

fname = "data.json"
with open(fname, 'w') as f:
    json.dump(final_data, f)
    print(f"Wrote {fname}!")