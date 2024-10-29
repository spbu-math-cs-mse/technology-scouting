import EntryPageVisual from "./components/EntryPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminTable from "./components/AdminTable";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<EntryPageVisual />} />
        <Route path="/admin-panel" element={<AdminTable />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
