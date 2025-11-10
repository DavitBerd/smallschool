import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./profile.module.scss";

const Profile = () => {
  const { user } = useAuth();
  const [semester, setSemester] = useState(1);

  if (!user) return null;

  const semValue = user.semesters?.[semester - 1] ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Profile</h2>
          <div className={styles.info}>Email: {user.email}</div>
          <div className={styles.info}>Role: {user.role}</div>
          <div className={styles.info}>Group: {user.group}</div>
          <div className={styles.info}>
            Missed lectures: {user.missedLectures}
          </div>
        </div>

        {user.role === "student" && (
          <div className={styles.card}>
            <h3>Semester Grades</h3>
            <div className={styles.semesterSelect}>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
                <option value={3}>Semester 3</option>
              </select>
            </div>
            <div className={styles.grade}>
              Sum grade: <strong>{semValue}</strong> / 100
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
