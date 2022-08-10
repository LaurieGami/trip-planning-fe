import PropTypes from "prop-types";
import { matchPath, useLocation } from "react-router-dom";

import { Box, List } from "@mui/material";

import NavItem from "./NavItem";

function NavList({ navConfig, ...other }) {
  const { pathname } = useLocation();
  const match = (path) =>
    path ? !!matchPath({ path, end: false }, pathname) : false;

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} active={match} />
        ))}
      </List>
    </Box>
  );
}

NavList.propTypes = {
  navConfig: PropTypes.array,
};

export default NavList;
