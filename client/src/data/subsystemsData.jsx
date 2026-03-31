import React from 'react';

export const CpuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

export const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

export const UmbrellaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12a10.06 10.06 0 0 0-20 0Z" />
    <path d="M12 12v8" />
    <path d="m9 19 3 1 3-1" />
  </svg>
);

export const FlaskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2v6L3 17a2 2 0 0 0 1.7 3h14.6A2 2 0 0 0 21 17l-6-9V2" />
    <line x1="5" y1="14" x2="19" y2="14" />
  </svg>
);

export const AntennaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
  </svg>
);

export const subsystems = [
  {
    id: "avionics",
    title: "Avionics",
    desc: "Flight computers, telemetry, and sensor integration. The brain of the rocket.",
    icon: <CpuIcon />
  },
  {
    id: "airframe",
    title: "Airframe",
    desc: "Rocket structure, aerodynamics, and stability design. Built to withstand max-Q.",
    icon: <WrenchIcon />
  },
  {
    id: "recovery",
    title: "Recovery",
    desc: "Parachute deployment and recovery mechanisms. Ensuring a safe touchdown.",
    icon: <UmbrellaIcon />
  },
  {
    id: "payload",
    title: "Payload",
    desc: "Scientific payloads and onboard experiments gathering crucial flight data.",
    icon: <FlaskIcon />
  },
  {
    id: "ground-station",
    title: "Ground Station",
    desc: "Communication, live data visualization, and tracking from the launchpad.",
    icon: <AntennaIcon />
  }
];
