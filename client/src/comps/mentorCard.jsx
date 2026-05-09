import "../styles/MSsec.css";
export default function MentorCard({
  Photo,
  Name,
  Subsystem,
  "Hierarchal position": position,
  "Email ID": email,
  "LinkedIN ID": linkedin,
}) {
  const defaultAvatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
    Name || "mentor",
  )}&backgroundColor=0b132b,111827,1e293b&color=f97316&radius=50`;
  const avatarSrc = Photo?.trim() ? Photo : defaultAvatar;
  const emailLink = email ? `mailto:${email}` : null;
  const linkedinLink = linkedin?.trim() ? linkedin : null;

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = defaultAvatar;
  };

  return (
    <div className="mentorCard">
      <div className="mentorCard_avatar">
        <img
          src={avatarSrc}
          onError={handleImageError}
          alt={Name ? `${Name}'s profile picture` : "mentor profile picture"}
          className="mentorCard_image"
        />
      </div>

      <div className="mentorCard_body">
        <p className="mentorCard_name">{Name || "Mentor"}</p>
        <p className="mentorCard_sys">{Subsystem || "subsystem"}</p>
        <p className="mentorCard_des">{position || "Member"}</p>
      </div>
    {/*email char code used*/}
      <div className="mentorCard_actions">
        {emailLink && (
          <a
            className="mentorCard_action mentorCard_action-email"
            href={emailLink}
            title={email}
            aria-label={`Email ${Name || "mentor"}`}
            target="_blank"
          >
            <span className="mentorCard_action-icon">&#9993;</span> 
            Email
          </a>
        )}
        {linkedinLink && (
          <a
            className="mentorCard_action mentorCard_action-linkedin"
            href={linkedinLink}
            title={linkedin}
            target="_blank"
          >
            <span className="mentorCard_action-icon">in</span>
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}
