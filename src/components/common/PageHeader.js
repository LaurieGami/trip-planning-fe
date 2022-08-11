import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";

function PageHeader({ type = "text", title, subtitle, button, ...props }) {
  if (type === "button") {
    return (
      <Stack
        display="flex"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        {...props}
      >
        <Typography variant="h4">{title}</Typography>
        {button}
      </Stack>
    );
  }

  return (
    <Stack direction="column" mb={5} {...props}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1">{subtitle}</Typography>
    </Stack>
  );
}

PageHeader.propTypes = {
  type: PropTypes.oneOf(["text", "button"]),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  button: PropTypes.node,
};

export default PageHeader;
