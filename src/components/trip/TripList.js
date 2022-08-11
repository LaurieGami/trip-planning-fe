import PropTypes from "prop-types";

import { Grid } from "@mui/material";
import TripCard from "./TripCard";

function TripList({ trips, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {trips.map((trip) => (
        <Grid key={trip.id} item xs={12} sm={6} md={3}>
          <TripCard trip={trip} />
        </Grid>
      ))}
    </Grid>
  );
}

TripList.propTypes = {
  trips: PropTypes.array.isRequired,
};

export default TripList;
