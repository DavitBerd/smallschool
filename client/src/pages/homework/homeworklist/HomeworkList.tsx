import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./homeworkList.module.scss";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import type { Homework } from "../../../types/types";

const PAGE_SIZE = 5;
const GROUPS = ["A1", "A2", "B1", "B2"];

const HomeworkList = () => {
  const [list, setList] = useState<Homework[]>([]);
  const [page, setPage] = useState(0);
  const [groupFilter, setGroupFilter] = useState<string>("All");
  const { user } = useAuth();

  const fetchList = async () => {
    try {
      const res = await api.get("/homeworks");
      setList(res.data);
      setPage(0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList =
    groupFilter === "All"
      ? list
      : list.filter((hw) => hw.group === groupFilter);
  const startIndex = page * PAGE_SIZE;
  const pagedList = filteredList.slice(startIndex, startIndex + PAGE_SIZE);
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Homeworks</h2>
          {user && (user.role === "mentor" || user.role === "admin") && (
            <Link to="/homeworks/new" className={styles.btn}>
              Create homework
            </Link>
          )}
        </div>

        <div className={styles.filter}>
          <label>
            Filter by group:
            <select
              value={groupFilter}
              onChange={(e) => {
                setGroupFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="All">All</option>
              {GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          {pagedList.map((hw) => (
            <div key={hw._id} className={styles.card}>
              <div className={styles.info}>
                <h3>{hw.name}</h3>
                <p dangerouslySetInnerHTML={{ __html: hw.description || "" }} />
              </div>
              <div className={styles.meta}>
                <div>
                  Group: {hw.group} • Semester: {hw.semester}
                </div>
                <div>
                  <div>Points: {hw.points}</div>
                  <div>Deadline: {new Date(hw.deadline).toLocaleString()}</div>
                  <div>
                    <Link to={`/homeworks/${hw._id}`}>Open</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredList.length === 0 && (
            <div className={styles.card}>No homeworks found.</div>
          )}
        </div>

        {filteredList.length > PAGE_SIZE && (
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
        )}
      </div>
    </div>
  );
};

export default HomeworkList;
