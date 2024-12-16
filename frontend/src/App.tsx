import EntryPageVisual from "./components/EntryPage";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import AuthProvider, { useAuth } from "./logic/AuthProvider";

export const LOGIN_PATH = "/login";
export const MAIN_PAGE_PATH = "/admin-panel";

export const PrivateRoute = () => {
  const { token } = useAuth();
  if (!token) return <Navigate to={LOGIN_PATH} />;
  return <Outlet />;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path={LOGIN_PATH} element={<EntryPageVisual />} />
          <Route element={<PrivateRoute />}>
            <Route path={MAIN_PAGE_PATH} element={<AdminPanel />} />
          </Route>
          <Route path="/" element={<Navigate to={LOGIN_PATH} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
