

import React from "react";

const subsystemsList = [
  { name: "🛰️ Avionics", desc: "Flight computers, telemetry, and sensor integration." },
  { name: "🛠️ Airframe", desc: "Rocket structure, aerodynamics, and stability design." },
  { name: "🪂 Recovery", desc: "Parachute deployment and recovery systems." },
  { name: "🧪 Payload", desc: "Scientific payloads and onboard experiments." },
  { name: "📡 Ground Station", desc: "Communication and live data visualization." },
];

const Subsystems = () => {
  return (
    <div className="section">
      <h2>Subsystems Overview</h2>
      <div>
        {subsystemsList.map((s, i) => (
          <div key={i} style={{ margin: "1.5rem 0" }}>
            <h3 style={{ color: "#00ffff" }}>{s.name}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subsystems;