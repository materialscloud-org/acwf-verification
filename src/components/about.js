import MathJax from "better-react-mathjax/MathJax";

import "./about.css";

// These are used in
// * here, in the About section
// * in the metric selection help toolbar
// * when determining heatmap colors
// (should they be defined here?)
export const qualityThersh = {
  nu: { exc: 0.1, good: 0.33 },
  epsilon: { exc: 0.06, good: 0.2 },
  delta: { exc: 0.3, good: 0.95 },
};

// string keys stay in insertion order, so use this order to determine the citation number
const references = {
  main: "E. Bosoni et al., Comprehensive verification of all-electron and pseudopotential density functional theory (DFT) codes via universal common workflows., in preparation (2023)",
  archive: (
    <a href="https://doi.org/10.24435/materialscloud:tbd">
      https://doi.org/10.24435/materialscloud:tbd
    </a>
  ),
  lejaeghere: (
    <span>
      Lejaeghere, K. et al. Reproducibility in density functional theory
      calculations of solids. Science 351, aad3000-aad3000,{" "}
      <a href="https://doi.org/10.1126/science.aad3000">
        https://doi.org/10.1126/science.aad3000
      </a>{" "}
      (2016).
    </span>
  ),
  old_website: (
    <a href="https://molmod.ugent.be/deltacodesdft">
      https://molmod.ugent.be/deltacodesdft
    </a>
  ),
  acwf_paper: (
    <span>
      Huber, S. P. et al. Common workflows for computing material properties
      using different quantum engines. npj Comput. Mater. 7, 136,{" "}
      <a href="https://doi.org/10.1038/s41524-021-00594-6">
        https://doi.org/10.1038/s41524-021-00594-6
      </a>{" "}
      (2021).
    </span>
  ),
  acwf_repo: (
    <a href="https://github.com/aiidateam/aiida-common-workflows">
      https://github.com/aiidateam/aiida-common-workflows
    </a>
  ),
  scripts_repo: (
    <a href="https://github.com/aiidateam/acwf-verification-scripts">
      https://github.com/aiidateam/acwf-verification-scripts
    </a>
  ),
};

function refNr(key) {
  return Object.keys(references).indexOf(key) + 1;
}

function getRef(key) {
  return (
    <sup>
      <a className="cite-anchor" href={"#ref" + refNr(key)}>
        [{refNr(key)}]
      </a>
    </sup>
  );
}

export const aboutText = (
  <div>
    Density functional theory (DFT) is extensively used in condensed matter
    physics and materials science. Many different software codes and
    computational approaches have been developed to perform DFT calculations.
    This website is part of an effort to systematically assess the precision and
    evaluate the reliability of many of these computational approaches. It
    supplements the accompanying publication
    {getRef("main")} and interactively visualizes the relevant data. The raw
    data is published on the Materials Cloud Archive{getRef("archive")}.
    <br />
    This effort is a continuation of the the systematic assessment published in
    2016, that compared the performance of the DFT codes by calculating the
    equation of state (EOS) curves for 71 elemental crystals
    {getRef("lejaeghere")}. The website illustrating the results of that project
    is available at {getRef("old_website")}.
    <br />
    The performance of the computational approaches to solve the DFT equations
    is assessed, similarly to the previous study, by calculating the EOS curves.
    For every element in range Z=1 to 96, ten different crystals are calculated.
    They include 4 unaries (simple cubic, BCC, diamond, FCC) and 6 oxides (X
    <sub>2</sub>O, XO, X<sub>2</sub>O<sub>3</sub>, XO<sub>2</sub>, X<sub>2</sub>
    O<sub>5</sub>, XO<sub>3</sub>). The datasets produced by calculating the EOS
    curves for these 960 crystals can be divided into
    <ol className="ol-space-update">
      <li>
        A curated reference set of highly converged results using two
        independent all-electron DFT codes (FLEUR and WIEN2k).
      </li>
      <li>Other datasets obtained with various pseudopotential codes.</li>
    </ol>
    These datasets were produced in an automated fashion using the AiiDA common
    workflows (ACWF) infrastructure{getRef("acwf_paper")}
    {getRef("acwf_repo")} and the relevant scripts are available on GitHub
    {getRef("scripts_repo")}.
    <br />
    <MathJax>
      The EOS curves are calculated by fitting a variation of the DFT total
      energy \(E\) (or, more precisely, of the free energy \(E - TS\) including
      the entropic contribution due to the electronic smearing) versus cell
      volume \(V\) to the Birch-Murnaghan EOS, given by
      {"$$ E(V) = E_0 + \\frac{9V_0B_0}{16} \\left\\{ " +
        "\\left[ \\left( \\frac{V_0}{V} \\right)^{\\frac{2}{3}} - 1 \\right]^3 B_1 + " +
        "\\left[ \\left( \\frac{V_0}{V} \\right)^{\\frac{2}{3}} - 1 \\right]^2 " +
        "\\left[ 6 - 4 \\left( \\frac{V_0}{V} \\right)^{\\frac{2}{3}} \\right] " +
        "\\right\\}, \\tag{1}$$"}
      where the equilibrium volume \(V_0\), the bulk modulus \(B_0\), and its
      derivative with respect to pressure \(B_1\) can be extracted from a
      fitting procedure.
    </MathJax>
    <div className="about-h">Comparison metrics</div>
    In order to conveniently compare the performance of two different codes or
    computational approaches, we need a single-valued metric to describe the
    difference between two EOS curves. In this application we consider the
    following comparison metrics:
    <ol className="ol-space-update">
      <li>
        <MathJax>
          <b>ν</b> (nu) - a metric that captures the relative difference of
          \(V_0\), \(B_0\) and \(B_1\) with specified weights. The metric is
          calculated by
          {"$$ \\nu_{w_{V_0},w_{B_0},w_{B_1}}(a,b) = 100 \\sqrt{ \\sum_{Y=V_0,B_0,B_1} " +
            "\\left[ w_{Y} \\cdot \\frac{Y_{a}-Y_{b}}{(Y_{a}+Y_{b})/2} \\right] ^2}, \\tag{2}$$"}
          where \((V_0)_a\) indicates the value of \(V_0\) obtained by fitting
          the data of method \(a\), and so on. The values of the weights were
          determined as {"\\(w_{V_0} = 1\\)"}, {"\\(w_{B_0} = \\frac{1}{20}\\)"}{" "}
          and {"\\(w_{B_1} = \\frac{1}{400}\\)"} based the sensitivity of each
          parameter to numerical noise in the fitting procedure
          {getRef("main")}. As reported in the publication{getRef("main")}, an
          excellent agreement is{" "}
          {"\\(\\nu<" + qualityThersh["nu"]["exc"] + "\\)"}, while a good
          agreement is {"\\(\\nu<" + qualityThersh["nu"]["good"] + "\\)"}.
        </MathJax>
      </li>
      <li>
        <MathJax>
          <b>ε</b> (epsilon) - a metric that represents the area between the two
          EOS curves normalized by the average value of the two curves, and is
          given by
          {"$$ \\varepsilon(a,b) = \\sqrt{\\frac{ \\langle[E_{a}(V) - E_{b}(V)]^2 \\rangle} " +
            "{\\sqrt{\\langle [E_{a}(V) - \\langle E_{a} \\rangle]^2 \\rangle  \\langle " +
            "[ E_{b}(V) - \\langle E_{b} \\rangle]^2 \\rangle}} }, \\tag{3}$$"}
          where
          {
            "$$ \\langle f \\rangle = \\frac{1}{V_{M}-V_{m}}\\int_{V_{m}}^{V_{M}} f(V) ~ dV, \\tag{4}$$"
          }
          and \(V_M\), \(V_m\) define the considered volume range (\(\pm 6\%\)
          around a central reference volume for our case){getRef("main")}. As
          reported in the publication{getRef("main")}, an excellent agreement is{" "}
          {"\\(\\varepsilon<" + qualityThersh["epsilon"]["exc"] + "\\)"}, while
          a good agreement is{" "}
          {"\\(\\varepsilon<" + qualityThersh["epsilon"]["good"] + "\\)"}.
        </MathJax>
      </li>
      <li>
        <MathJax>
          <b>Δ</b> (delta) - the metric used in the previous study
          {getRef("lejaeghere")}, representing the area between the two EOS
          curves. It is given by
          {
            "$$ \\Delta(a,b) = \\sqrt{\\langle [E_{a}(V) - E_{b}(V)]^2 \\rangle}. \\tag{5}$$"
          }
          This metric has the shortcoming of being too sensitive to the value of
          the bulk modulus of the material. In this website, the values are
          normalized by the number of atoms. As mentioned in the publication
          {getRef("main")}, an excellent agreement (when the bulk modulus is not
          too small) could be considered for{" "}
          {"\\(\\Delta<" +
            qualityThersh["delta"]["exc"] +
            "\\ \\text{[meV/atom]}\\)"}
          , while a good agreement for{" "}
          {"\\(\\Delta<" +
            qualityThersh["delta"]["good"] +
            "\\ \\text{[meV/atom]}\\)"}
          .
        </MathJax>
      </li>
    </ol>
    <div className="about-h">References</div>
    {Object.keys(references).map((key) => {
      let nr = refNr(key);
      return (
        <div id={"ref" + nr} key={nr}>
          [{nr}] {references[key]}
        </div>
      );
    })}
  </div>
);
