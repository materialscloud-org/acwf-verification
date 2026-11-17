import { useState } from "react";
import MaterialsCloudHeader from "mc-react-header";
import { MathJaxContext } from "better-react-mathjax";
import { McAppHeader } from "mc-react-library";

import About, { Introduction } from "./AboutContent";
import Acwf from "./Acwf";

const TITLE =
  "Verification of the precision of DFT implementations via AiiDA common workflows";

// MathJax for the formulas of the "About" tab (no right-click menu)
const MATHJAX_CONFIG = {
  options: {
    renderActions: {
      addMenu: [],
    },
  },
};

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

function App() {
  const [tab, setTab] = useState("use");
  return (
    <MathJaxContext config={MATHJAX_CONFIG}>
      <MaterialsCloudHeader
        activeSection="discover"
        breadcrumbsPath={[
          { name: "Discover", link: "https://www.materialscloud.org/discover" },
          { name: TITLE, link: null },
        ]}
      />

      <main className="min-h-screen bg-[aliceblue] pb-10">
        <div className="mx-auto max-w-7xl px-4">
          {/* main-page: the scope of index.css's Bootstrap-compatible base */}
          <div className="main-page bg-white p-4 shadow-sm">
            <McAppHeader
              title={TITLE}
              logo={`${import.meta.env.BASE_URL}acwf-logo.png`}
              logoAlt="ACWF logo"
              dois={[{ doi: "10.24435/materialscloud:s4-3h", label: "DOI" }]}
            />
            <Introduction />
            <div
              role="tablist"
              className="flex flex-wrap border-b border-[#dee2e6]"
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
            {/* Both panes stay mounted, so the selection survives switching tabs */}
            <div
              role="tabpanel"
              id="tabpanel-use"
              aria-labelledby="tab-use"
              hidden={tab !== "use"}
            >
              <div className="description">
                Select an element to show the equation of state (EOS) curves for
                various reference structures containing it (unaries and oxides)
                and to compare results among multiple codes and computational
                approaches. Note: the PBE functional is used for the current
                data.
              </div>
              <div style={{ marginTop: "6px" }}>
                <Acwf />
              </div>
            </div>
            <div
              role="tabpanel"
              id="tabpanel-about"
              aria-labelledby="tab-about"
              hidden={tab !== "about"}
            >
              <About />
            </div>
          </div>
        </div>
      </main>
    </MathJaxContext>
  );
}

export default App;
