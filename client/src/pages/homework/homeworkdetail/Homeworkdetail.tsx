/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./homeworkDetails.module.scss";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";
import type { Homework, Submission, CreateForm } from "../../../types/types";

const HomeworkDetails = ({ isCreate }: { isCreate?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hw, setHw] = useState<Homework | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { register, handleSubmit } = useForm<CreateForm>();
  const { register: regSub, handleSubmit: handleSub } = useForm<{
    link: string;
  }>();

  useEffect(() => {
    if (!isCreate && id) {
      fetchHw();
      fetchSubs();
    }
  }, [id, isCreate]);

  const fetchHw = async () => {
    const res = await api.get<Homework>(`/homeworks/${id}`);
    setHw(res.data);
  };

  const fetchSubs = async () => {
    try {
      const res = await api.get<Submission[]>(`/homeworks/${id}/submissions`);
      setSubmissions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const onCreate = async (data: CreateForm) => {
    try {
      const payload = {
        ...data,
        semester: Number(data.semester),
        points: Number(data.points),
        deadline: new Date(data.deadline).toISOString(),
      };
      const res = await api.post<Homework>("/homeworks", payload);
      navigate(`/homeworks/${res.data._id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const submitLink = async (payload: { link: string }) => {
    try {
      await api.post(`/homeworks/${id}/submissions`, payload);
      alert("Submitted");
      fetchSubs();
    } catch (e) {
      console.error(e);
      alert("Submission failed");
    }
  };

  const gradeSubmission = async (submissionId: string) => {
    if (!hw) return alert("Homework not loaded yet");
    const value = prompt(`Enter grade (max ${hw.points}):`);
    let grade = value ? Number(value) : NaN;
    if (isNaN(grade)) return;
    if (grade > hw.points) {
      alert(`Grade cannot exceed ${hw.points}. It will be set to maximum.`);
      grade = hw.points;
    }
    try {
      await api.patch(`/homeworks/submissions/${submissionId}/grade`, {
        grade,
      });
      alert("Graded");
      fetchSubs();
    } catch (e) {
      console.error(e);
      alert("Failed to grade");
    }
  };

  if (isCreate) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.headerWithBack}>
              <h2>Create Homework</h2>
              <button
                className={styles.backBtn}
                onClick={() => navigate("/homeworks")}
              >
                Back
              </button>
            </div>
            <form onSubmit={handleSubmit(onCreate)}>
              <label>
                Name
                <input {...register("name", { required: true })} />
              </label>
              <label>
                Description
                <textarea {...register("description")} />
              </label>
              <label>
                Points
                <input
                  type="number"
                  {...register("points", { valueAsNumber: true })}
                />
              </label>
              <label>
                Deadline
                <input type="datetime-local" {...register("deadline")} />
              </label>
              <label>
                Group
                <select {...register("group", { required: true })}>
                  <option value="">Select group</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </label>
              <label>
                Semester
                <select {...register("semester", { required: true })}>
                  <option value="">Select semester</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </label>
              <button className={styles.btn} type="submit">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>{hw?.name}</h2>
          <div>{hw?.description}</div>
          <div>
            Points: {hw?.points} • Deadline:{" "}
            {hw ? new Date(hw.deadline).toLocaleString() : ""}
          </div>
          <div>
            Group: {hw?.group} • Semester: {hw?.semester}
          </div>
        </div>

        {user?.role === "student" && (
          <div className={styles.card}>
            <h3>Submit link</h3>
            <form onSubmit={handleSub(submitLink)}>
              <label>
                Link
                <input {...regSub("link", { required: true })} />
              </label>
              <button className={styles.btn}>Submit</button>
            </form>
          </div>
        )}

        {(user?.role === "mentor" || user?.role === "admin") && (
          <div className={styles.card}>
            <h3>Submissions</h3>
            {submissions.length === 0 && <div>No submissions yet</div>}
            {submissions.map((s) => (
              <div key={s._id} className={styles.submissionItem}>
                <div className={styles.submissionInfo}>
                  <div>{s.student.email}</div>
                  <div>
                    Link:{" "}
                    <a href={s.link} target="_blank" rel="noreferrer">
                      {s.link}
                    </a>
                  </div>
                  <div>Grade: {s.grade ?? "N/A"}</div>
                </div>
                <div>
                  {!s.graded && (
                    <button
                      className={styles.btn}
                      onClick={() => gradeSubmission(s._id)}
                    >
                      Grade
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeworkDetails;
