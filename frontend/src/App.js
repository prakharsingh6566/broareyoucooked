import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Analysis from "@/pages/Analysis";
import Results from "@/pages/Results";
import History from "@/pages/History";
import Tips from "@/pages/Tips";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<Analysis />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/tips" element={<Tips />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
