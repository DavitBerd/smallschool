import { useForm } from "react-hook-form";
import styles from "./login.module.scss";
import { useAuth } from "../../../context/AuthContext";

type FormData = { email: string; password: string };

const Login = () => {
  const { login, loading } = useAuth();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await login(data.email, data.password);
  };

  return (
    <div className={styles.page}>
      <form className={styles.authCard} onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>
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
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <div className={styles.muted}>
          No account? <a href="/register">Register (demo)</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
