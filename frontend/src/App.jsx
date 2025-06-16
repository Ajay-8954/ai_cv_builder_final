import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";


import TemplateSelection from "./components/TemplateSelection"
import TemplateBuilderWrapper from "./components/TemplateBuilderWrapper";
import AnalyzeAtsScore from "./components/AnalyzeAtsScore";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/templates" element={<TemplateSelection />} />
            <Route path="/builder/:templateId" element={<TemplateBuilderWrapper />} />
            <Route path="/analyze" element={<AnalyzeAtsScore />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
