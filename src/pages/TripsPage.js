import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useAccount } from "../context/authContext";

import { Container, Button } from "@mui/material";
import { Add } from "@mui/icons-material";

import Page from "../components/common/Page";
import PageHeader from "../components/common/PageHeader";
import TripList from "../components/trip/TripList";

const GET_TRIPS = gql`
  query GetTrips($userId: ID!) {
    getTrips(userId: $userId) {
      id
      title
      createdBy
      createdAt
      departureDate
      returnDate
      location
      participants {
        id
        firstName
        lastName
      }
      tripStatus
      updatedAt
    }
  }
`;

function TripsPage() {
  const { user } = useAccount();

  const [trips, setTrips] = useState([]);

  //   const handleClick = (event, id) => {

  //   };

  useQuery(GET_TRIPS, {
    variables: { userId: user.id },
    onCompleted({ getTrips }) {
      setTrips(getTrips);
    },
  });

  return (
    <Page title="Trips">
      <Container>
        <PageHeader
          type="button"
          title="Trips"
          button={
            <Button
              variant="contained"
              component={RouterLink}
              to="/dashboard/create-trip"
              startIcon={<Add />}
            >
              New Trip
            </Button>
          }
        />
        <TripList trips={trips} />
      </Container>
    </Page>
  );
}

export default TripsPage;
