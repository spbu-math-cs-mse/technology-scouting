import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import ApplicationTable from "./ApplicationTable";
import ResourceTable from "./ResourceTable";
import { styled } from "@mui/material/styles";
import AdminRegistrationDialog from "./AddAdminDialog";
import { postAddNewAdmin } from "../logic/request";

const StyledBorderButton = styled(Button)<ButtonProps>({
  fontSize: "11px",
  width: "100%",
  minWidth: "50px",
  maxWidth: "120px",
  height: "48px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  lineHeight: "1.2",
  whiteSpace: "normal",
  wordBreak: "break-word",
});

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<
    "applications" | "resources"
  >("applications");

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
            onClick={() => setActiveSection("applications")}
            variant="contained"
            sx={{ fontSize: "0.6rem" }}
          >
            Show applications
          </StyledBorderButton>

          <StyledBorderButton
            onClick={() => setActiveSection("resources")}
            variant="contained"
            sx={{ fontSize: "0.6rem" }}
          >
            Show resources
          </StyledBorderButton>
        </Grid>

        <Grid container size={{ xs: 2 }} width="fit-content">
          <StyledBorderButton
            onClick={() => {
              setRegistrationDialogOpen(true);
            }}
            variant="contained"
            color="inherit"
            sx={{ alignSelf: "center", fontSize: "0.6rem" }}
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
        {activeSection === "applications" ? (
          <ApplicationTable />
        ) : (
          <ResourceTable />
        )}
      </Grid>

      <AdminRegistrationDialog
        open={registrationDialogOpen}
        setOpen={setRegistrationDialogOpen}
        addAdmin={(login: string, password: string) =>
          postAddNewAdmin(login, password)
        }
      />
    </Box>
  );
}
