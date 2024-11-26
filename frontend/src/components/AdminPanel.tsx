import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import RequestTable from "./RequestTable";
import ResourceTable from "./ResourceTable";
import { styled } from "@mui/material/styles";
import AdminRegistrationDialog from "./AddAdminDialog";

const StyledBorderButton = styled(Button)<ButtonProps>({
  fontSize: "11px",
  width: "100%",
  minWidth: "150px",
  maxWidth: "200px",
});

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<"section1" | "section2">(
    "section1"
  );

  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Grid
        container
        spacing={2}
        padding={2}
        justifyContent={"space-between"}
        flexDirection="column"
        width="fit-content"
        sx={{
          backgroundColor: "#f0f0f0",
          flexShrink: 0,
        }}
      >
        <Grid
          container
          size={{ xs: 2 }}
          width="fit-content"
          flexDirection="column"
        >
          <StyledBorderButton
            onClick={() => setActiveSection("section1")}
            variant="contained"
          >
            Show requests
          </StyledBorderButton>

          <StyledBorderButton
            onClick={() => setActiveSection("section2")}
            variant="contained"
          >
            Show resources
          </StyledBorderButton>
        </Grid>

        <Grid container size={{ xs: 2 }} width="fit-content">
          <StyledBorderButton
            onClick={() => {setRegistrationDialogOpen(true)}}
            variant="contained"
            color="inherit"
            sx={{ alignSelf: "center" }}
          >
            Add new admin
          </StyledBorderButton>
        </Grid>
      </Grid>

      <Grid
        size={{ xs: 10 }}
        sx={{
          padding: 2,
          overflow: "auto",
        }}
      >
        {activeSection === "section1" ? <RequestTable /> : <ResourceTable />}
      </Grid>

      <AdminRegistrationDialog
        open={registrationDialogOpen}
        setOpen={setRegistrationDialogOpen}
        addAdmin={(login: string, password: string) => {}}
      />
    </Box>
  );
}
