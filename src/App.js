import "./App.css";
import ACWF from "./components/ACWF";
import MaterialsCloudHeader from "react-materialscloud-header";

function App() {
  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        { name: "ACWF verification", link: null },
      ]}> 
      <div className="App">
        <ACWF />
      </div>
    </MaterialsCloudHeader> 
  );
}

export default App;
