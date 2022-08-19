import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "../../context/authContext";
import { useAccount } from "../../context/authContext";

import DashboardLayout from "./DashboardLayout";
import LandingPage from "../../pages/LandingPage";
import HomePage from "../../pages/HomePage";
import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";
import LogoutPage from "../../pages/LogoutPage";
import TripsPage from "../../pages/TripsPage";
import TripDetailsPage from "../../pages/TripDetailsPage";
import CreateTripPage from "../../pages/CreateTripPage";
import ParticipantsPage from "../../pages/ParticipantsPage";

function App() {
  const { user } = useAccount();

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {user ? (
          <Route index element={<Navigate to="/dashboard" replace />} />
        ) : (
          <Route index element={<Navigate to="/landing" replace />} />
        )}
        <Route path="landing" element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<HomePage />} />
        <Route
          path="trips"
          element={
            <RequireAuth>
              <TripsPage />
            </RequireAuth>
          }
        />
        <Route
          path="trips/:id"
          element={
            <RequireAuth>
              <TripDetailsPage />
            </RequireAuth>
          }
        />
        <Route
          path="create-trip"
          element={
            <RequireAuth>
              <CreateTripPage />
            </RequireAuth>
          }
        />
        <Route
          path="participants"
          element={
            <RequireAuth>
              <ParticipantsPage />
            </RequireAuth>
          }
        />
        <Route
          path="logout"
          element={
            <RequireAuth>
              <LogoutPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
