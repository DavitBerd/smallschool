import { NavLink } from "react-router-dom";

import styles from "./Navbar.module.scss";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <NavLink to="/" className={styles.brand}>
        MySchool
      </NavLink>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/homeworks"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Homeworks
        </NavLink>
        {user && (user.role === "mentor" || user.role === "admin") && (
          <>
            <NavLink
              to="/presence"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Presence
            </NavLink>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Students
            </NavLink>
          </>
        )}
        {user && user.role === "admin" && (
          <NavLink
            to="/adminpanel"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Add User
          </NavLink>
        )}
      </nav>
      <div className={styles.footer}>
        {user ? (
          <>
            <div className={styles.user}>
              {user.email} ({user.role})
            </div>
            <button className={styles.btnGhost} onClick={() => logout()}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={styles.link}>
            Login
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Navbar;
