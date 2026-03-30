// // import "./App.css";
// // import MSsec from "./MSsec.js";
// // import Home from "./components/Home";
// // import { useState } from "react";

// // const Subsystems = () => <div><h2>Test</h2></div>;

// // function App() {
// //   const [activeTab, setActiveTab] = useState("home");

// //   const mentors = [
// //     {
// //       id: 1,
// //       profileUrl: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
// //       name: "Aditya",
// //       sys: "Avionics",
// //       des: "...",
// //       email: "adi@gmail.com",
// //       linkedin: "...",
// //     },
// //     {
// //       id: 2,
// //       profileUrl: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
// //       name: "Jane Doe",
// //       sys: "Software Engineer",
// //       des: "...",
// //       email: "jane@gmail.com",
// //       linkedin: "...",
// //     },
// //   ];

// //   const sponsors = [
// //     {
// //       name: "Sponsor One",
// //       logoUrl: "https://via.placeholder.com/150x80/0000FF/FFFFFF?text=Sponsor+1",
// //     },
// //     {
// //       name: "Sponsor Two",
// //       logoUrl: "https://via.placeholder.com/150x80/FF0000/FFFFFF?text=Sponsor+2",
// //     },
// //     {
// //       name: "Sponsor Three",
// //       logoUrl: "https://via.placeholder.com/150x80/00FF00/FFFFFF?text=Sponsor+3",
// //     },
// //   ];

// //   return (
// //     <div className="App">
// //       {/* Navigation Bar */}
// //       <nav className="navbar">
// //         <button
// //           className={activeTab === "home" ? "nav-btn active" : "nav-btn"}
// //           onClick={() => setActiveTab("home")}
// //         >
// //           Home
// //         </button>
// //         <button
// //           className={activeTab === "subsystems" ? "nav-btn active" : "nav-btn"}
// //           onClick={() => setActiveTab("subsystems")}
// //         >
// //           Subsystems
// //         </button>
// //         <button
// //           className={activeTab === "team" ? "nav-btn active" : "nav-btn"}
// //           onClick={() => setActiveTab("team")}
// //         >
// //           Team & Sponsors
// //         </button>
// //       </nav>

// //       {/* Tab Content */}
// //       {activeTab === "home" && <Home />}
// //       {activeTab === "subsystems" && <Subsystems />}
// //       {activeTab === "team" && <MSsec mentorList={mentors} sponsors={sponsors} />}
// //     </div>
// //   );
// // }

// // export default App;

















// import "./App.css";
// import MSsec from "./MSsec.js";
// import Home from "./components/Home.js";
// import Subsystems from "./components/Subsystems.js";
// import { useState } from "react";

// function App() {
//   const [activeTab, setActiveTab] = useState("home");

//   const mentors = [
//     {
//       id: 1,
//       profileUrl: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//       name: "Aditya",
//       sys: "Avionics",
//       des: "...",
//       email: "adi@gmail.com",
//       linkedin: "...",
//     },
//     {
//       id: 2,
//       profileUrl: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//       name: "Jane Doe",
//       sys: "Software Engineer",
//       des: "...",
//       email: "jane@gmail.com",
//       linkedin: "...",
//     },
//   ];

//   const sponsors = [
//     {
//       name: "Sponsor One",
//       logoUrl: "https://via.placeholder.com/150x80/0000FF/FFFFFF?text=Sponsor+1",
//     },
//     {
//       name: "Sponsor Two",
//       logoUrl: "https://via.placeholder.com/150x80/FF0000/FFFFFF?text=Sponsor+2",
//     },
//     {
//       name: "Sponsor Three",
//       logoUrl: "https://via.placeholder.com/150x80/00FF00/FFFFFF?text=Sponsor+3",
//     },
//   ];

//   return (
//     <div className="App">
//       <nav className="navbar">
//         <button
//           className={activeTab === "home" ? "nav-btn active" : "nav-btn"}
//           onClick={() => setActiveTab("home")}
//         >
//           Home
//         </button>
//         <button
//           className={activeTab === "subsystems" ? "nav-btn active" : "nav-btn"}
//           onClick={() => setActiveTab("subsystems")}
//         >
//           Subsystems
//         </button>
//         <button
//           className={activeTab === "team" ? "nav-btn active" : "nav-btn"}
//           onClick={() => setActiveTab("team")}
//         >
//           Team & Sponsors
//         </button>
//       </nav>

//       {activeTab === "home" && <Home />}
//       {activeTab === "subsystems" && <Subsystems />}
//       {activeTab === "team" && <MSsec mentorList={mentors} sponsors={sponsors} />}
//     </div>
//   );
// }

// export default App;









import "./App.css";
import MSsec from "./MSsec.js";
import Home from "./components/Home.js";
import Subsystems from "./components/Subsystems.js";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const mentors = [
    {
      id: 1,
      profileUrl: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      name: "Aditya",
      sys: "Avionics",
      des: "...",
      email: "adi@gmail.com",
      linkedin: "...",
    },
    {
      id: 2,
      profileUrl: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      name: "Jane Doe",
      sys: "Software Engineer",
      des: "...",
      email: "jane@gmail.com",
      linkedin: "...",
    },
  ];

  const sponsors = [
    {
      name: "Sponsor One",
      logoUrl: "https://via.placeholder.com/150x80/0000FF/FFFFFF?text=Sponsor+1",
    },
    {
      name: "Sponsor Two",
      logoUrl: "https://via.placeholder.com/150x80/FF0000/FFFFFF?text=Sponsor+2",
    },
    {
      name: "Sponsor Three",
      logoUrl: "https://via.placeholder.com/150x80/00FF00/FFFFFF?text=Sponsor+3",
    },
  ];

  return (
    <div className="App">
      <nav className="navbar">
        <button
          className={activeTab === "home" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={activeTab === "subsystems" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("subsystems")}
        >
          Subsystems
        </button>
        <button
          className={activeTab === "team" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("team")}
        >
          Team & Sponsors
        </button>
      </nav>

      {activeTab === "home" && <Home />}
      {activeTab === "subsystems" && <Subsystems />}
      {activeTab === "team" && <MSsec mentorList={mentors} sponsors={sponsors} />}
    </div>
  );
}

export default App;