/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./studentsList.module.scss";
import api from "../../api/axios";
import type { Student } from "../../types/types";

const GROUPS = ["A1", "A2", "B1", "B2"];
const PER_PAGE = 5;

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [group, setGroup] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/users/students", {
        params: group ? { group } : {},
      });
      setStudents(res.data);
      setPage(1);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [group]);

  const totalPages = Math.ceil(students.length / PER_PAGE);
  const visibleStudents = students.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Students</h2>
        </div>

        <div className={styles.filter}>
          <label>
            Filter by group:
            <select value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">All</option>
              {GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          {visibleStudents.map((s) => (
            <div key={s._id} className={styles.studentCard}>
              <div className={styles.studentInfo}>
                <div>
                  <strong>{s.email}</strong>
                </div>
                <div>Group: {s.group}</div>
              </div>
              <div className={styles.studentInfo}>
                <div>Missed: {s.missedLectures}</div>
                <div>
                  Semesters:{" "}
                  {s.semesters.map((g, idx) => (
                    <span key={idx}>
                      {g}
                      {idx < s.semesters.length - 1 ? " | " : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;
