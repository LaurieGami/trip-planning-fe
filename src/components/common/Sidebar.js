import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAccount } from "../../context/authContext";

import { styled } from "@mui/material/styles";
import { Box, Link, Drawer, Typography, Avatar } from "@mui/material";
import { Luggage, Groups, Logout } from "@mui/icons-material";
import useResponsive from "../../hooks/useResponsive";

import Logo from "./Logo";
import NavList from "../nav/NavList";

const navConfig = [
  {
    title: "Trips",
    path: "/dashboard/trips",
    icon: <Luggage />,
  },
  {
    title: "Participants",
    path: "/dashboard/participants",
    icon: <Groups />,
  },
  {
    title: "Logout",
    path: "/dashboard/logout",
    icon: <Logout />,
  },
];

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

function Sidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const { user } = useAccount();

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <>
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          {user && (
            <AccountStyle>
              {/* <Avatar src={user.photoURL} alt="photoURL" /> */}
              <Avatar alt="photoURL" />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                  {user.email}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {user.email}
                </Typography>
              </Box>
            </AccountStyle>
          )}
        </Link>
      </Box>

      <NavList navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}

Sidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default Sidebar;
