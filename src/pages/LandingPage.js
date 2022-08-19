import { Link } from "react-router-dom";

import { Container, Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import Page from "../components/common/Page";

const ContainerStyle = styled(Container)({
    display: "flex",
    minHeight: "100%",
    gap: "1rem"
  });

const BoxStyle = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "50%"
  });

function LandingPage() {
    return (
        <Page title="Welcome">
            <ContainerStyle>
                <BoxStyle>
                    <img
                        src="/assets/images/hiking.png"
                        alt="Hiking Illustration"
                    />
                </BoxStyle>
                <BoxStyle>
                    <Typography variant="h1">
                        Leave a trip plan.
                    </Typography>
                    <Typography variant="h4">
                        No matter where in the world, we can help you get there and back safe.
                    </Typography>
                    <Button
                        color="primary"
                        variant="contained"
                    >
                        <Link
                            to="/register"
                            style={{ textDecoration: 'none', color: 'white' }}
                        >
                            Get started!
                        </Link>
                    </Button>
                </BoxStyle>
            </ContainerStyle>
        </Page>
    );
}

export default LandingPage;
