import PropTypes from "prop-types";
import { format } from "date-fns";

import {
  Box,
  Card,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Person, Save } from "@mui/icons-material";

import Label from "../common/Label";
import TripForm from "../form/TripForm";

function dateToDateAndTime(date) {
  return {
    date: format(date, "PP"),
    time: format(date, "p"),
  };
}

const CoverImgStyle = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

const OverlayBoxStyle = styled(Box)({
  background:
    "linear-gradient(to right, rgba(0, 0, 0, 0.35), rgba(15, 20, 28, 0.25))",
  overflow: "hidden",
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
  zIndex: 8,
});

function TripDetailsCard({
  trip,
  editing = false,
  setEditing = () => {},
  handleUpdate = () => {},
  updateStatus = null,
}) {
  const {
    id,
    title,
    createdAt,
    departureDate,
    returnDate,
    location,
    participants,
    tripStatus,
    updatedAt,
    cover,
  } = trip;

  return (
    <Card>
      <Box sx={{ pt: "300px", position: "relative" }}>
        <Box
          sx={{
            zIndex: 9,
            bottom: 16,
            left: 16,
            position: "absolute",
            color: "white",
          }}
        >
          <Typography variant="h3" noWrap>
            {title}
          </Typography>
          <Label
            variant="filled"
            color={(tripStatus === "overdue" && "error") || "info"}
            sx={{
              textTransform: "uppercase",
            }}
          >
            {tripStatus}
          </Label>
          <Typography variant="h6" noWrap marginTop={1}>
            {location}
          </Typography>
        </Box>
        <OverlayBoxStyle />
        <CoverImgStyle
          alt={title}
          src={cover ? cover : "/static/default-images/trip.jpg"}
        />
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {createdAt && (
            <Typography variant="subtitle2">
                Created at: {dateToDateAndTime(createdAt).date} at{" "}
                {dateToDateAndTime(createdAt).time}
            </Typography>
          )}
          {updatedAt && (
            <Typography variant="subtitle2">
              Last updated at: {dateToDateAndTime(updatedAt).date} at{" "}
              {dateToDateAndTime(updatedAt).time}
            </Typography>
          )}
        </Box>
        {!editing ? (
          <>
            <Box>
              <Typography variant="h6">Departure:</Typography>
              {departureDate ? (
                <>
                  <Typography variant="body1">
                    Date: {dateToDateAndTime(departureDate).date}
                  </Typography>
                  <Typography variant="body1">
                    Time: {dateToDateAndTime(departureDate).time}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">
                  Edit this trip to add a departure date & time.
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="h6">Return:</Typography>
              {returnDate ? (
                <>
                  <Typography variant="body1">
                    Date: {dateToDateAndTime(returnDate).date}
                  </Typography>
                  <Typography variant="body1">
                    Time: {dateToDateAndTime(returnDate).time}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1">
                  Edit this trip to add a return date & time.
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="h6">Participants</Typography>
              {participants.length > 0 ? (
                <List>
                  {participants.map((p) => {
                    return (
                      <ListItem key={p.id}>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <Typography key={p.id} variant="body1">
                          {p.firstName} {p.lastName}
                        </Typography>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body1">
                  Edit this trip to add participants.
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <TripForm
            type="update"
            tripValues={trip}
            handleSubmit={handleUpdate}
            setEditing={setEditing}
            loading={updateStatus?.loading}
            error={updateStatus?.error}
          />
        )}
      </Stack>
    </Card>
  );
}

TripDetailsCard.propTypes = {
  trip: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
  handleUpdate: PropTypes.func,
};

export default TripDetailsCard;
