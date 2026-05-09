import React from 'react';

export const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const SatelliteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7 9 3 5 7l4 4" />
    <path d="m17 11 4 4-4 4-4-4" />
    <path d="m8 12 4 4 6-6-4-4Z" />
    <path d="m16 8 3-3" />
    <path d="M9 21a6 6 0 0 0-6-6" />
  </svg>
);

export const GaugeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </svg>
);

export const TelescopeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44" />
    <path d="m13.56 11.747 4.332-.924" />
    <path d="m16 21-3.105-6.21" />
    <path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z" />
    <path d="m6.158 8.633 1.114 4.456" />
    <path d="m8 21 3.105-6.21" />
    <circle cx="12" cy="13" r="2" />
  </svg>
);

export const projects = [
  {
    id: "project-alpha",
    title: "Project Alpha",
    desc: "A high-powered sounding rocket designed to reach 30,000 ft altitude with a custom solid motor.",
    icon: <RocketIcon />,
    fullDescription: "Project Alpha is our flagship sounding rocket initiative aimed at pushing the boundaries of amateur rocketry. The vehicle features a custom-designed solid rocket motor, advanced composite airframe, and a fully autonomous flight computer. The mission objective is to achieve a target apogee of 30,000 feet while carrying a suite of atmospheric sensors to collect temperature, pressure, and humidity data throughout the flight envelope.",
    status: "In Progress",
    timeline: "Jan 2025 – Dec 2025",
    teamSize: 18,
    objectives: [
      "Achieve 30,000 ft apogee with a custom solid motor",
      "Validate in-house composite airframe manufacturing process",
      "Collect atmospheric data across the full flight profile",
      "Demonstrate dual-deployment recovery with GPS tracking"
    ]
  },
  {
    id: "sat-link",
    title: "SatLink",
    desc: "A CubeSat communication relay prototype for low-Earth orbit data transmission experiments.",
    icon: <SatelliteIcon />,
    fullDescription: "SatLink is a 1U CubeSat communication relay prototype designed to explore low-cost data transmission solutions for low-Earth orbit missions. The project involves developing a compact UHF/VHF transceiver system, an onboard data handling unit, and a deployable antenna array. SatLink will serve as a testbed for store-and-forward messaging, enabling remote ground stations to exchange data packets through the orbiting relay.",
    status: "Design Phase",
    timeline: "Mar 2025 – Jun 2026",
    teamSize: 12,
    objectives: [
      "Design and fabricate a 1U CubeSat-compliant bus",
      "Develop a UHF/VHF transceiver with 9600 baud capability",
      "Implement store-and-forward communication protocol",
      "Pass environmental qualification testing (vibration, thermal-vacuum)"
    ]
  },
  {
    id: "thrust-bench",
    title: "ThrustBench",
    desc: "A modular static test stand for characterizing solid and hybrid rocket motors up to 5 kN.",
    icon: <GaugeIcon />,
    fullDescription: "ThrustBench is a versatile, ground-based static test facility engineered for characterizing rocket motors ranging from small experimental grains to mid-power hybrid engines. The stand features a six-axis load cell, high-speed pressure transducers, and an automated ignition and abort system. All data is streamed in real-time to our Ground Station software for live visualization and post-test analysis.",
    status: "Operational",
    timeline: "Aug 2024 – Ongoing",
    teamSize: 8,
    objectives: [
      "Support thrust measurements up to 5 kN with ±0.5% accuracy",
      "Integrate real-time data streaming to the Ground Station dashboard",
      "Implement automated safety interlocks and remote ignition",
      "Provide a reusable platform for iterating on motor designs"
    ]
  },
  {
    id: "stargazer",
    title: "Stargazer",
    desc: "An autonomous star-tracking payload for testing celestial navigation algorithms on suborbital flights.",
    icon: <TelescopeIcon />,
    fullDescription: "Stargazer is an experimental payload module that uses a CMOS star tracker camera and onboard FPGA processing to identify star patterns in real time during suborbital flight. The goal is to validate celestial navigation algorithms that can determine spacecraft attitude without reliance on GPS or ground-based references. The payload is designed to be flight-agnostic and can be integrated into any of our sounding rockets as a secondary experiment.",
    status: "Prototyping",
    timeline: "Jun 2025 – Mar 2026",
    teamSize: 10,
    objectives: [
      "Develop a lightweight star tracker using a CMOS sensor and custom optics",
      "Implement real-time star pattern matching on an FPGA",
      "Achieve attitude determination accuracy of < 0.1° in suborbital conditions",
      "Validate algorithms with hardware-in-the-loop simulation before flight"
    ]
  }
];
