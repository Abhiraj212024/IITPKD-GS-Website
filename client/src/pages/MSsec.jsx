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
        const response = await axios.get("/member");
        console.log("Fetched mentors:", response.data);
        setMentorList(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching mentors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  return (
    <div className="MSsec">
      <div className="toggle-btn-container">
        <button
          onClick={() => setCurrentView("mentors")}
          className={`view-toggle-btn ${currentView === "mentors" ? "active" : "inactive"}`}
        >
          Our Mentors
        </button>
        <button
          onClick={() => setCurrentView("sponsors")}
          className={`view-toggle-btn ${currentView === "sponsors" ? "active" : "inactive"}`}
        >
          Our Sponsors
        </button>
      </div>

      {currentView === "mentors" ? (
        <>
          {loading && <p className="status-message">Loading mentors...</p>}
          {error && (
            <p className="status-message error">
              Failed to load mentors: {error}
            </p>
          )}

          {!loading && !error && (
            <ul>
              {mentorList.map((mentor) => (
                <li key={mentor._id}>
                  <MentorCard {...mentor} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <SponsorCard sponsors={sponsors} />
      )}
    </div>
  );
}
