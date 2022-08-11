import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MoreVert, Delete, Edit } from "@mui/icons-material";

import DeleteParticipantDialog from "./DeleteParticipantDialog";

function ParticipantMoreButton({ participant, userId }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <MoreVert />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem sx={{ color: "text.secondary" }} onClick={() => setIsDeleteOpen(true)}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to="#"
          sx={{ color: "text.secondary" }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
      <DeleteParticipantDialog
        participant={participant}
        userId={userId}
        open={isDeleteOpen}
        handleClose={setIsDeleteOpen}
      />
    </>
  );
}

ParticipantMoreButton.propTypes = {
  participant: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
};

export default ParticipantMoreButton
