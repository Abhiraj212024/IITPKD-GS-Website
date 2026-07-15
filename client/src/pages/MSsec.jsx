import { useState, useEffect } from "react";
import axios from "axios";
import MentorCard from "../comps/mentorCard";
import SponsorCard from "../comps/sponsorCard";
import "../styles/MSsec.css";

export default function MSsec({ sponsors }) {
  const [currentView, setCurrentView] = useState("faculty");
  const [mentorList, setMentorList] = useState([]);
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "faculty", label: "Faculty Advisors" },
    { id: "leads", label: "Team Leads" },
    { id: "propulsion", label: "Propulsion" },
    { id: "ground-station", label: "Ground Station" },
    { id: "avionics", label: "Avionics" },
    { id: "airframe-recovery", label: "Airframe & Recovery" },
    { id: "payload", label: "Payload" },
    { id: "alumni", label: "Alumni & Legacy" }, // Renamed from "Alumni"
    { id: "sponsors", label: "Sponsors" },
  ];

  // Utility checking functions
  const isLegacyMember = (member) => {
    const pos = (member["Hierarchal position"] || "").toLowerCase();
    return pos.includes("23") || pos.includes("legacy");
  };

  const isFacultyMember = (member) => {
    const sub = (member.Subsystem || "").toLowerCase();
    const pos = (member["Hierarchal position"] || "").toLowerCase();
    return (
      sub.includes("faculty") ||
      sub.includes("advisor") ||
      pos.includes("faculty") ||
      pos.includes("advisor")
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both members and alumni concurrently
        const [memberRes, alumniRes] = await Promise.allSettled([
          axios.get("/member"),
          axios.get("/alumni"),
        ]);

        let hasFaculty = false;
        let membersData = [];

        if (memberRes.status === "fulfilled") {
          membersData = memberRes.value.data;
          console.log("Fetched members:", membersData);
          setMentorList(membersData);

          // Check if there are any current Faculty Advisors in the database
          hasFaculty = membersData.some(
            (member) => isFacultyMember(member) && !isLegacyMember(member)
          );
        } else {
          console.error("Error fetching members:", memberRes.reason);
        }

        if (alumniRes.status === "fulfilled") {
          console.log("Fetched alumni:", alumniRes.value.data);
          setAlumniList(alumniRes.value.data);
        } else {
          console.error("Error fetching alumni:", alumniRes.reason);
        }

        // UX Optimization: If no active faculty advisors exist, default to "leads"
        if (!hasFaculty && membersData.length > 0) {
          setCurrentView("leads");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredMembers = () => {
    switch (currentView) {
      case "faculty":
        return mentorList.filter(
          (member) => isFacultyMember(member) && !isLegacyMember(member)
        );

      case "leads":
        return mentorList.filter(
          (member) =>
            (member["Hierarchal position"] || "").toLowerCase().includes("lead") &&
            !isFacultyMember(member) &&
            !isLegacyMember(member)
        );

      case "propulsion":
        return mentorList.filter(
          (member) =>
            (member.Subsystem || "").toLowerCase() === "propulsion" &&
            !isFacultyMember(member) &&
            !isLegacyMember(member)
        );

      case "ground-station":
        return mentorList.filter((member) => {
          const sub = (member.Subsystem || "").toLowerCase();
          return (
            (sub === "ground station" || sub === "ground-station") &&
            !isFacultyMember(member) &&
            !isLegacyMember(member)
          );
        });

      case "avionics":
        return mentorList.filter(
          (member) =>
            (member.Subsystem || "").toLowerCase() === "avionics" &&
            !isFacultyMember(member) &&
            !isLegacyMember(member)
        );

      case "airframe-recovery":
        return mentorList.filter((member) => {
          const sub = (member.Subsystem || "").toLowerCase();
          return (
            (sub === "air frame" || sub === "airframe" || sub === "recovery") &&
            !isFacultyMember(member) &&
            !isLegacyMember(member)
          );
        });

      case "payload":
        return mentorList.filter(
          (member) =>
            (member.Subsystem || "").toLowerCase() === "payload" &&
            !isFacultyMember(member) &&
            !isLegacyMember(member)
        );

      default:
        return [];
    }
  };

  const getLegacyAndAlumniList = () => {
    const mappedAlumni = alumniList.map((alumnus) => ({
      _id: alumnus._id,
      Photo: alumnus.Photo,
      Name: alumnus.Name,
      Subsystem: alumnus.Subsystem,
      "Hierarchal position": alumnus["Hierarchical Position"] || "Alumni",
      "Email ID": alumnus.Email,
      "LinkedIN ID": alumnus["LinkedIN ID"],
      Batch: alumnus["Batch and Branch"],
      CurrentStatus: alumnus["Current Education/Job "],
    }));

    const mappedLegacy = mentorList
      .filter(isLegacyMember)
      .map((member) => ({
        _id: member._id,
        Photo: member.Photo,
        Name: member.Name,
        Subsystem: member.Subsystem,
        "Hierarchal position": member["Hierarchal position"],
        "Email ID": member["Email ID"],
        "LinkedIN ID": member["LinkedIN ID"],
      }));

    return [...mappedLegacy, ...mappedAlumni];
  };

  const filteredMembers = getFilteredMembers();
  const legacyAndAlumniList = getLegacyAndAlumniList();

  return (
    <div className="MSsec page-transition">
      <div className="toggle-btn-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`view-toggle-btn ${currentView === tab.id ? "active" : "inactive"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="status-message">Loading details...</p>}
      {error && <p className="status-message error">Failed to load: {error}</p>}

      {!loading && !error && (
        <div className="tab-content-wrapper">
          {currentView === "sponsors" ? (
            <SponsorCard sponsors={sponsors} />
          ) : currentView === "alumni" ? (
            legacyAndAlumniList.length === 0 ? (
              <p className="status-message">No records found.</p>
            ) : (
              <ul>
                {legacyAndAlumniList.map((person) => (
                  <li key={person._id}>
                    <MentorCard
                      {...{
                        Photo: person.Photo,
                        Name: person.Name,
                        Subsystem: person.Subsystem,
                        "Hierarchal position": person["Hierarchal position"],
                        "Email ID": person["Email ID"],
                        "LinkedIN ID": person["LinkedIN ID"],
                        Batch: person.Batch,
                        CurrentStatus: person.CurrentStatus,
                      }}
                    />
                  </li>
                ))}
              </ul>
            )
          ) : filteredMembers.length === 0 ? (
            <p className="status-message">No members found in this category.</p>
          ) : (
            <ul>
              {filteredMembers.map((member) => (
                <li key={member._id}>
                  <MentorCard {...member} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
