import { Outlet } from "react-router-dom";

import { styled } from "@mui/material/styles";

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

function PublicLayout() {
  return (
    <RootStyle>
      <Outlet />
    </RootStyle>
  );
}

export default PublicLayout;
