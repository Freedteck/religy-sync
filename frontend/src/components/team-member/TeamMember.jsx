import styles from "./TeamMember.module.css";
const TeamMember = ({ initials, name, role, bio }) => {
  return (
    <div className={styles["team-member"]}>
      <div className={styles["member-avatar"]}>{initials}</div>
      <h3 className={styles["member-name"]}>{name}</h3>
      <p className={styles["member-role"]}>{role}</p>
      <p className={styles["member-bio"]}>{bio}</p>
    </div>
  );
};

export default TeamMember;
