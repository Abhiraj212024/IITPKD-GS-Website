import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Subsystems from "./pages/Subsystems";
import SubsystemDetail from "./pages/SubsystemDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Subsystems />} />
      <Route path="/subsystems/:id" element={<SubsystemDetail />} />
    </Routes>
  );
}
