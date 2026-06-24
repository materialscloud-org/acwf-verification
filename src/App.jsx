import "./App.css";
import MainPage from "./components/MainPage";

import { MathJaxContext } from "better-react-mathjax";

function App() {
  let mathJaxConfig = {
    // disable mathjax right-click menu
    options: {
      renderActions: {
        addMenu: [],
      },
    },
  };
  return (
    <div className="App">
      <MathJaxContext config={mathJaxConfig}>
        <MainPage />
      </MathJaxContext>
    </div>
  );
}

export default App;
