import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styles from "./register.module.scss";

type FormData = {
  email: string;
  password: string;
  role?: string;
  group?: string;
};

const Register = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    console.log("Registration (demo) data:", data);
    alert(
      "Registration demo: check console (no server call). Admin must create real users."
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
          <h2>Register (demo)</h2>
          <label>
            Email
            <input {...register("email")} type="email" />
          </label>
          <label>
            Password
            <input {...register("password")} type="password" />
          </label>
          <label>
            Role (demo)
            <select {...register("role")}>
              <option value="student">student</option>
              <option value="mentor">mentor</option>
            </select>
          </label>
          <button type="submit" className={styles.btn}>
            Print to console
          </button>
          <div className={styles.backLink}>
            Have an account?{" "}
            <Link to="/login" className={styles.linkBtn}>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
