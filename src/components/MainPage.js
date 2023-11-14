import ACWF from "./ACWF";

import "./MainPage.css";

import MaterialsCloudHeader from "mc-react-header";

import AppHeader from "./AppHeader";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { aboutText } from "./about";

function MainPage() {
  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "Verification of the precision of DFT implementations via AiiDA common workflows",
          link: null,
        },
      ]}
    >
      <div className="main-page">
        <AppHeader />
        {/* <div className="note">NOTE: This is a beta version!</div> */}
        <div className="description">
          This section contains reference and verification datasets of equations
          of state (EOS) calculated with different density functional theory
          (DFT) codes using the AiiDA common workflows (ACWF) infrastructure.
          The data is published and discussed in the article:
          <div className="citation">
            E. Bosoni, L. Beal, M. Bercx, P. Blaha, S. Blügel, J. Bröder, M.
            Callsen, S. Cottenier, A. Degomme, V. Dikan, K. Eimre, E.
            Flage-Larsen, M. Fornari, A. Garcia, L. Genovese, M. Giantomassi, S.
            P. Huber, H. Janssen, G. Kastlunger, M. Krack, G. Kresse, T. D.
            Kühne, K. Lejaeghere, G. K. H. Madsen, M. Marsman, N. Marzari, G.
            Michalicek, H. Mirhosseini, T. M. A. Müller, G. Petretto, C. J.
            Pickard, S. Poncé, G. Rignanese, O. Rubel, T. Ruh, M. Sluydts, D. E.
            P. Vanpoucke, S. Vijay, M. Wolloch, D. Wortmann, A. V. Yakutovich,
            J. Yu, A. Zadoks, B. Zhu, and G. Pizzi,{" "}
            <i>
              How to verify the precision of density-functional-theory
              implementations via reproducible and universal workflows
            </i>
            ,{" "}
            <a
              href="https://doi.org/10.1038/s42254-023-00655-3"
              className="citation-link"
            >
              <span className="custom-bold">Nat. Rev. Phys.</span> (2023)
            </a>
          </div>
        </div>
        <Tabs defaultActiveKey="use" className="acwf-tabs">
          <Tab eventKey="use" title="Use">
            <div className="description">
              Select an element to show the equation of state (EOS) curves for
              various reference structures containing it (unaries and oxides)
              and to compare results among multiple codes and computational
              approaches. Note: the PBE functional is used for the current data.
            </div>
            <div style={{ marginTop: "6px" }}>
              <ACWF />
            </div>
          </Tab>
          <Tab eventKey="about" title="About">
            <div className="description">{aboutText}</div>
          </Tab>
        </Tabs>
      </div>
    </MaterialsCloudHeader>
  );
}

export default MainPage;
