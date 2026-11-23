
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { fetchUser } from "./utils/userSlice";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import LogoutButton from "./components/LogoutButton";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAssignments from "./pages/StudentAssignments";
import StudentGroups from "./pages/StudentGroups";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<ProtectedRoute role="STUDENT" />}>
          <Route
            path="/student"
            element={<StudentDashboard />}
          />

          <Route
            path="/student/assignments"
            element={<StudentAssignments />}
          />

          <Route path="/student/groups"
            element={<StudentGroups />}
          />
        </Route>

        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
