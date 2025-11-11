import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import styles from "./admin.module.scss";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

type FormData = {
  email: string;
  password: string;
  role: "student" | "mentor" | "admin";
  group?: string;
};

const AdminAddUser = () => {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/users", data);
      alert("User added successfully");
      navigate("/students");
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
          <h2>Add User</h2>
          <label>
            Email
            <input {...register("email", { required: true })} type="email" />
          </label>
          <label>
            Password
            <input
              {...register("password", { required: true })}
              type="password"
            />
          </label>
          <label>
            Role
            <select {...register("role", { required: true })}>
              <option value="student">student</option>
              <option value="mentor">mentor</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <label>
            Group (for students)
            <input {...register("group")} />
          </label>
          <button type="submit" className={styles.btn}>
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser;
