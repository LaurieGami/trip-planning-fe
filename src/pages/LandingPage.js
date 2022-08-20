import { Link } from "react-router-dom";

import { Grid, Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

// import Page from "../components/common/Page";

const GridStyle = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "pink",
}));

function LandingPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          m: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          width: "80%",
        }}
      >
        <Button color="primary" variant="outlined">
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Login
          </Link>
        </Button>
        <Button color="primary" variant="contained">
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Sign Up
          </Link>
        </Button>
      </Box>
      <Grid container spacing={3} sx={{ margin: "0", width: "100%" }}>
        <GridStyle item xs={12} sm={12} md={6}>
          <img src="/assets/images/hiking.png" alt="Hiking Illustration" />
        </GridStyle>
        <GridStyle item xs={12} sm={12} md={6}>
          <Typography variant="h1">Leave a trip plan.</Typography>
          <Typography variant="h4" sx={{ pb: 3 }}>
            No matter where in the world, we can help you get there and back
            safe.
          </Typography>
          <Box>
            <Button color="primary" variant="contained">
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "white" }}
              >
                Get started!
              </Link>
            </Button>
          </Box>
        </GridStyle>
      </Grid>
    </Box>
  );
}

export default LandingPage;
