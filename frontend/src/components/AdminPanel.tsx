import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import Button from "@mui/material/Button";
import RequestTable from "./RequestTable";
import ResourceTable from "./ResourceTable";

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<"section1" | "section2">(
    "section1"
  );

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Grid
        item
        xs={2}
        sx={{
          backgroundColor: "#f0f0f0",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          onClick={() => setActiveSection("section1")}
          variant="contained"
          sx={{
            fontSize: "11px",
            width: "100%",
            minWidth: "150px",
            maxWidth: "200px",
          }}
        >
          Watch requests
        </Button>

        <Button
          onClick={() => setActiveSection("section2")}
          variant="contained"
          sx={{
            fontSize: "11px",
            width: "100%",
            minWidth: "150px",
            maxWidth: "200px",
          }}
        >
          Watch resources
        </Button>
      </Grid>

      <Grid
        item
        xs={10}
        sx={{
          padding: 2,
          overflow: "auto",
        }}
      >
        {activeSection === "section1" && <RequestTable />}
        {activeSection === "section2" && <ResourceTable />}
      </Grid>
    </Box>
  );
}
