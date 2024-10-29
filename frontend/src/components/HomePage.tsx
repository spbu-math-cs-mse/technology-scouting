import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import * as React from "react";


export default function HomePageVisual() {
  

  const [errorAlertOpened, setErrorAlertOpened] = useState(false);
  const [errorText, setErrorText] = useState("");

  return (
    <Box sx={{ width: "90%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>

        <Grid size={12}>
          Hello!
        </Grid>
      </Grid>
      <ErrorAlert
        opened={errorAlertOpened}
        setOpened={(open: boolean) => setErrorAlertOpened(open)}
        errorText={errorText}
      />
    </Box>
  );
}
