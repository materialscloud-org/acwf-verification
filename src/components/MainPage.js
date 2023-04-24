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
        { name: "ACWF verification", link: null },
      ]}
    >
      <div className="main-page">
        <AppHeader />
        <div className="note">NOTE: This is a beta version!</div>
        <div className="description">
          This section contains reference and verification datasets of
          equations of states (EOS) calculated with different density functional
          theory (DFT) codes using the AiiDA common workflows (ACWF) infrastructure. The data
          is published and discussed in the article:
          <div className="citation">
            E. Bosoni et al., Comprehensive verification of all-electron and
            pseudopotential density functional theory (DFT) codes via universal
            common workflows., in preparation (2023)
          </div>
        </div>
        <Tabs defaultActiveKey="use" className="acwf-tabs">
          <Tab eventKey="use" title="Use">
            <div className="description">
              Select an element to show the equation-of-state (EOS) curves for
              various reference structures containing it (unaries and oxides)
              and to compare results among multiple codes and computational approaches.
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
