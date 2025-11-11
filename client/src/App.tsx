import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/login/login";
import Register from "./pages/auth/register/register";
import HomeworkDetails from "./pages/homework/homeworkdetail/Homeworkdetail";
import HomeworkList from "./pages/homework/homeworklist/HomeworkList";
import Presence from "./pages/presence/presence";
import Profile from "./pages/profile/profile";
import StudentsList from "./pages/studentslist/studentslist";
import Navbar from "./components/navbar/navbar";
import AdminAddUser from "./pages/Admin/admin";

const App = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/homeworks"
            element={
              <ProtectedRoute>
                <HomeworkList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <HomeworkList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/homeworks/new"
            element={
              <ProtectedRoute roles={["mentor", "admin"]}>
                <HomeworkDetails isCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/homeworks/:id"
            element={
              <ProtectedRoute>
                <HomeworkDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/presence"
            element={
              <ProtectedRoute roles={["mentor", "admin"]}>
                <Presence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute roles={["mentor", "admin"]}>
                <StudentsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminpanel"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminAddUser />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
