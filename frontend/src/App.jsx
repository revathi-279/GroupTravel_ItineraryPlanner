import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import Login
  from "./pages/Login/Login";

import Register
  from "./pages/Register/Register";

import Dashboard
  from "./pages/Dashboard/Dashboard";

import ProtectedRoute
  from "./routes/ProtectedRoute";

import TripDetails from "./pages/TripDetails/TripDetails";

import Profile
from "./pages/Profile/Profile";

function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trip/:tripId"
            element={
              <ProtectedRoute>
                <TripDetails />
              </ProtectedRoute>
            }
          />

          <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;