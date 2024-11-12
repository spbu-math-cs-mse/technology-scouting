import EntryPageVisual from "./components/EntryPage";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import RequestTable from "./components/RequestTable";
import ResourceTable from "./components/ResourceTable";
import AdminPanel from "./components/AdminPanel"


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<EntryPageVisual />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path = "/request-table" element = {<RequestTable/>}/>
        <Route path = "/resource-table" element = {<ResourceTable/>}/>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
