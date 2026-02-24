import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import GrievanceForm from "../pages/GrievanceForm";
import GrievanceList from "../pages/GrievanceList";
import GrievanceDetails from "../pages/GrievanceDetails";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-grievance"
          element={
            <ProtectedRoute>
              <GrievanceForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grievances"
          element={
            <ProtectedRoute>
              <GrievanceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grievances/:id"
          element={
            <ProtectedRoute>
              <GrievanceDetails />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
