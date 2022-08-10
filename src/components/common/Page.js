import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

import { Box } from "@mui/material";

const Page = forwardRef(({ title = "", meta, children, ...other }, ref) => (
  <>
    <Helmet>
      <title>{title} | Trip Planning App</title>
      {meta}
    </Helmet>

    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

Page.propTypes = {
  title: PropTypes.string,
  meta: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Page;
