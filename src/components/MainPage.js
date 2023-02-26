import ACWF from "./ACWF";

import "./MainPage.css";

import MaterialsCloudHeader from "mc-react-header";

import AppHeader from "./AppHeader";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

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
        <div className="note">
          NOTE: This is a beta version and preliminary data currently used!
        </div>
        <div className="description">
          This application contains a reference and a verification dataset of
          equations of states calculated with different density functional
          theory codes using the AiiDA common workflows infrastructure. The data
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
              Select an element to show the equation of state (EoS) curves and
              comparison between the studied codes and methods.
            </div>
            <div style={{ marginTop: "6px" }}>
              <ACWF />
            </div>
          </Tab>
          <Tab eventKey="about" title="About">
            <div className="description">To be added...</div>
          </Tab>
        </Tabs>
      </div>
    </MaterialsCloudHeader>
  );
}

export default MainPage;
