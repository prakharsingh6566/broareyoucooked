import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Analysis from "@/pages/Analysis";
import Results from "@/pages/Results";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<Analysis />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
