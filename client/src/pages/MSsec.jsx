import { useState, useEffect } from "react";
import axios from "axios";
import MentorCard from "../comps/mentorCard";
import SponsorCard from "../comps/sponsorCard";
import "../styles/MSsec.css";

export default function MSsec({ sponsors }) {
  const [currentView, setCurrentView] = useState("mentors");
  const [mentorList, setMentorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/member');
        console.log('Fetched mentors:', response.data);
        setMentorList(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching mentors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const btnStyle = {
    padding: "10px 20px",
    border: "2px solid white",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
  };

  const activeStyle = {
    ...btnStyle,
    background: "white",
    color: "black",
  };

  const inactiveStyle = {
    ...btnStyle,
    background: "transparent",
    color: "white",
  };

  return (
    <div className="MSsec">
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "24px" }}>
        <button
          onClick={() => setCurrentView("mentors")}
          style={currentView === "mentors" ? activeStyle : inactiveStyle}
        >
          Show Mentors
        </button>
        <button
          onClick={() => setCurrentView("sponsors")}
          style={currentView === "sponsors" ? activeStyle : inactiveStyle}
        >
          Show Sponsors
        </button>
      </div>

      {currentView === "mentors" ? (
        loading ? (
          <p>Loading mentors...</p>
        ) : error ? (
          <p>Error loading mentors: {error}</p>
        ) : (
          <ul>
            {mentorList.map((mentor) => (
              <li key={mentor._id}>
                <MentorCard {...mentor} />
              </li>
            ))}
          </ul>
        )
      ) : (
        <SponsorCard sponsors={sponsors} />
      )}
    </div>
  );
}