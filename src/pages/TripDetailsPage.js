import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { format } from "date-fns";
// import { useAccount } from "../context/authContext";

import { Container, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";

import Page from "../components/common/Page";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";
import TripDetailsCard from "../components/trip/TripDetailsCard";

function formatDateToDateAndTime(date) {
  const newDate = new Date(parseInt(date));
  return {
    date: format(newDate, "PP"),
    time: format(newDate, "p"),
  };
}

const GET_TRIP = gql`
  query GetTrip($id: ID!) {
    getTrip(id: $id) {
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

const UPDATE_TRIP = gql`
  mutation UpdateTrip($id: ID!, $tripUpdateInput: TripUpdateInput) {
    updateTrip(id: $id, tripUpdateInput: $tripUpdateInput) {
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

function TripDetailsPage() {
  //   const { user } = useAccount();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [editing, setEditing] = useState(false);

  const { data, loading } = useQuery(GET_TRIP, {
    variables: { id },
  });

  const [updateTrip] = useMutation(UPDATE_TRIP);

  function handleSave(tripUpdate) {
    console.log("SAVED tripUpdate", tripUpdate);
    // updateTrip({ variables: { id, updateTrip: tripUpdate }})
    setEditing(false);
  }

  useEffect(() => {
    if (data) {
      const { getTrip: trip } = data;

      const formattedTrip = {
        ...trip,
        createdAt: formatDateToDateAndTime(trip.createdAt),
        departureDate: trip.departureDate
          ? formatDateToDateAndTime(trip.departureDate)
          : null,
        returnDate: trip.returnDate
          ? formatDateToDateAndTime(trip.returnDate)
          : null,
        updatedAt: trip.updatedAt
          ? formatDateToDateAndTime(trip.updatedAt)
          : null,
      };

      setTrip(formattedTrip);
    }
  }, [data]);

  return (
    <Page title="Trip Details">
      <Container>
        {loading && <Loading />}
        {!loading && trip && (
          <>
            <PageHeader
              type="button"
              title={trip.title}
              button={
                !editing && (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                )
              }
            />
            <TripDetailsCard
              trip={trip}
              editing={editing}
              onSave={handleSave}
            />
          </>
        )}
      </Container>
    </Page>
  );
}

export default TripDetailsPage;
