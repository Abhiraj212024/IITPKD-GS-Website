import "../styles/MSsec.css";
export default function MentorCard({
  profileUrl,
  name,
  sys,
  des,
  email,
  linkedin,
}) {
  return (
    <div className="mentorCard">
      <img
        src={profileUrl}
        alt={`${name}'s profile picture`}
        className="mentorCard_image"
      />

      <p className="mentorCard_name">{name}</p>
      <p className="mentorCard_sys">{sys}</p>
      <p className="mentorCard_des">{des}</p>
      <div className="mentorCard_links">
        <p className="mentorCard_link mentorCard_link-email">{email}</p>
        <p className="mentorCard_link mentorCard_link-linkedin">{linkedin}</p>
      </div>
    </div>
  );
}
