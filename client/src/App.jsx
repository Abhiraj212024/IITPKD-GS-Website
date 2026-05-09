import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Subsystems from "./pages/Subsystems.jsx";
import SubsystemDetail from "./pages/SubsystemDetail.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import MSsec from "./pages/MSsec.jsx";
import { sponsors } from "./data/sponsorsData.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subsystems" element={<Subsystems />} />
        <Route path="/subsystems/:id" element={<SubsystemDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/team" element={<MSsec sponsors={sponsors} />} />
      </Routes>
    </>
  );
}