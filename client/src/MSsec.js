import React, { useState } from "react";
import MentorCard from "./mentorCard.js";
import Sponsor from "./sponsor.js";
import "./MSsec.css";

export default function MSsec({ mentorList, sponsors }) {
  const [currentView, setCurrentView] = useState("mentors");

  return (
    <div className="MSsec">
      <div className="view-toggle-buttons">
        <button
          onClick={() => setCurrentView("mentors")}
          className={currentView === "mentors" ? "active" : ""}
        >
          Show Mentors
        </button>
        <button
          onClick={() => setCurrentView("sponsors")}
          className={currentView === "sponsors" ? "active" : ""}
        >
          Show Sponsors
        </button>
      </div>

      {currentView === "mentors" ? (
        <ul>
          {mentorList.map((mentor) => (
            <li key={mentor.id}>
              <MentorCard {...mentor} />
            </li>
          ))}
        </ul>
      ) : (
        <Sponsor sponsors={sponsors} />
      )}
    </div>
  );
}
