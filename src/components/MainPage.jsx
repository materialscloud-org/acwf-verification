import { useState } from "react";
import { McAppHeader } from "mc-react-library";

import ACWF from "./ACWF";

import "./MainPage.css";

import MaterialsCloudHeader from "mc-react-header";

import { aboutText } from "./about";

const TITLE =
  "Verification of the precision of DFT implementations via AiiDA common workflows";

const TABS = [
  { key: "use", title: "Use" },
  { key: "about", title: "About" },
];

// Bootstrap's nav-tabs, with the app's borders (#ddd, #999 when active)
const TAB_CLASS =
  "-mb-px rounded-t-[0.375rem] border px-4 py-2 text-base transition-colors";
const TAB_ACTIVE =
  "border-x-[#999] border-t-[#999] border-b-white bg-white text-[#495057]";
const TAB_INACTIVE =
  "border-x-[#ddd] border-t-[#ddd] border-b-transparent text-[#0d6efd] hover:border-b-[#dee2e6] hover:text-[#0a58ca]";

function MainPage() {
  const [tab, setTab] = useState("use");
  return (
    <>
      <MaterialsCloudHeader
        activeSection={"discover"}
        breadcrumbsPath={[
          { name: "Discover", link: "https://www.materialscloud.org/discover" },
          {
            name: TITLE,
            link: null,
          },
        ]}
      ></MaterialsCloudHeader>
      <div className="main-page">
        <McAppHeader
          title={TITLE}
          logo={`${import.meta.env.BASE_URL}acwf-logo.png`}
          logoAlt="ACWF logo"
          dois={[{ doi: "10.24435/materialscloud:s4-3h", label: "DOI" }]}
        />
        {/* <div className="note">NOTE: This is a beta version!</div> */}
        <div className="description">
          This section contains reference and verification datasets of equations
          of state (EOS) calculated with different density functional theory
          (DFT) codes using the AiiDA common workflows (ACWF) infrastructure.
          The data is published and discussed in the article:
          <div className="citation">
            {/* E. Bosoni, L. Beal, M. Bercx, P. Blaha, S. Blügel, J. Bröder, M.
            Callsen, S. Cottenier, A. Degomme, V. Dikan, K. Eimre, E.
            Flage-Larsen, M. Fornari, A. Garcia, L. Genovese, M. Giantomassi, S.
            P. Huber, H. Janssen, G. Kastlunger, M. Krack, G. Kresse, T. D.
            Kühne, K. Lejaeghere, G. K. H. Madsen, M. Marsman, N. Marzari, G.
            Michalicek, H. Mirhosseini, T. M. A. Müller, G. Petretto, C. J.
            Pickard, S. Poncé, G. Rignanese, O. Rubel, T. Ruh, M. Sluydts, D. E.
            P. Vanpoucke, S. Vijay, M. Wolloch, D. Wortmann, A. V. Yakutovich,
            J. Yu, A. Zadoks, B. Zhu, and G. Pizzi,{" "} */}
            E. Bosoni et al.,{" "}
            <i>
              How to verify the precision of density-functional-theory
              implementations via reproducible and universal workflows
            </i>
            ,{" "}
            <a
              href="https://doi.org/10.1038/s42254-023-00655-3"
              className="citation-link"
            >
              <span className="custom-bold">Nat. Rev. Phys. 6</span>, 45-58
              (2024)
            </a>
          </div>
        </div>
        <div
          role="tablist"
          className="acwf-tabs flex flex-wrap border-b border-[#dee2e6]"
        >
          {TABS.map(({ key, title }) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-controls={`tabpanel-${key}`}
              aria-selected={tab === key}
              className={`${TAB_CLASS} ${
                tab === key ? TAB_ACTIVE : TAB_INACTIVE
              }`}
              onClick={() => setTab(key)}
            >
              {title}
            </button>
          ))}
        </div>
        {/* Both panes stay mounted (as with react-bootstrap's Tabs), so the
            selection survives switching tabs */}
        <div
          role="tabpanel"
          id="tabpanel-use"
          aria-labelledby="tab-use"
          hidden={tab !== "use"}
        >
          <div className="description">
            Select an element to show the equation of state (EOS) curves for
            various reference structures containing it (unaries and oxides) and
            to compare results among multiple codes and computational
            approaches. Note: the PBE functional is used for the current data.
          </div>
          <div style={{ marginTop: "6px" }}>
            <ACWF />
          </div>
        </div>
        <div
          role="tabpanel"
          id="tabpanel-about"
          aria-labelledby="tab-about"
          hidden={tab !== "about"}
        >
          <div className="description">{aboutText}</div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
