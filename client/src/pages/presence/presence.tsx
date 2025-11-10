import { useState } from "react";
import styles from "./presence.module.scss";
import api from "../../api/axios";
import type { User } from "../../types/types";

const GROUPS = ["A1", "A2", "B1", "B2"];
const PAGE_SIZE = 5;
type AttendanceState = Record<string, boolean>;

const Presence = () => {
  const [group, setGroup] = useState(GROUPS[0]);
  const [students, setStudents] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [page, setPage] = useState(0);

  const fetchStudents = async () => {
    const res = await api.get(`/attendance?group=${group}`);
    setStudents(res.data);
    const initialState: AttendanceState = {};
    res.data.forEach((s: User) => (initialState[s._id] = true));
    setAttendance(initialState);
    setPage(0);
  };

  const markAttendance = async (studentId: string, present: boolean) => {
    setAttendance((prev) => ({ ...prev, [studentId]: present }));
    try {
      await api.patch("/attendance", { studentId, present });
    } catch (e) {
      console.error(e);
    }
  };

  const startIndex = page * PAGE_SIZE;
  const pagedStudents = students.slice(startIndex, startIndex + PAGE_SIZE);
  const totalPages = Math.ceil(students.length / PAGE_SIZE);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Daily Attendance</h2>
          <div className={styles.controls}>
            <label>
              Group
              <select value={group} onChange={(e) => setGroup(e.target.value)}>
                {GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <button className={styles.btn} onClick={fetchStudents}>
              Load Students
            </button>
          </div>
        </div>

        {pagedStudents.length > 0 && (
          <div className={styles.card}>
            {pagedStudents.map((s) => (
              <div key={s._id} className={styles.studentRow}>
                <div className={styles.studentEmail}>{s.email}</div>
                <div className={styles.radioGroup}>
                  <label>
                    <input
                      type="radio"
                      name={`attendance-${s._id}`}
                      checked={attendance[s._id]}
                      onChange={() => markAttendance(s._id, true)}
                    />
                    Present
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`attendance-${s._id}`}
                      checked={attendance[s._id] === false}
                      onChange={() => markAttendance(s._id, false)}
                    />
                    Absent
                  </label>
                </div>
              </div>
            ))}

            <div className={styles.pagination}>
              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <div>
                Page {page + 1} / {totalPages}
              </div>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Presence;
