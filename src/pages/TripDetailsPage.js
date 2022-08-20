import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
// import { useAccount } from "../context/authContext";

import { Container, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";

import Page from "../components/common/Page";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";
import TripDetailsCard from "../components/trip/TripDetailsCard";

function stringToDate(date) {
  return new Date(parseInt(date));
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
      emergencyContacts {
        id
        firstName
        lastName
        phone
        email
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
      emergencyContacts {
        id
        firstName
        lastName
        phone
        email
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

  const [updateTrip, updatedTrip] = useMutation(UPDATE_TRIP, {
    onCompleted({ updateTrip }) {
      setEditing(false);
    },
  });

  function handleUpdate(values) {
    const tripUpdateInput = {
      title: values.title,
      departureDate: values.departureDate ? values.departureDate : null,
      returnDate: values.returnDate ? values.returnDate : null,
      location: values.location ? values.location : null,
      participants:
        values.participants.length > 0
          ? values.participants.map((p) => p.id)
          : null,
      emergencyContacts:
        values.emergencyContacts.length > 0
          ? values.emergencyContacts.map((c) => c.id)
          : null,
      tripStatus: values.tripStatus ? values.tripStatus : "draft",
    };
    updateTrip({ variables: { id, tripUpdateInput } });
  }

  function handleStatusUpdate(newStatus) {
    const tripUpdateInput = {
      tripStatus: newStatus
    };
    updateTrip({ variables: { id, tripUpdateInput } });
  }

  useEffect(() => {
    if (data) {
      const { getTrip } = data;

      const formattedTrip = {
        ...getTrip,
        createdAt: stringToDate(getTrip.createdAt),
        departureDate: getTrip.departureDate
          ? stringToDate(getTrip.departureDate)
          : null,
        returnDate: getTrip.returnDate
          ? stringToDate(getTrip.returnDate)
          : null,
        updatedAt: getTrip.updatedAt ? stringToDate(getTrip.updatedAt) : null,
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
              setEditing={setEditing}
              handleUpdate={handleUpdate}
              handleStatusUpdate={handleStatusUpdate}
              updateStatus={updatedTrip || null}
            />
          </>
        )}
      </Container>
    </Page>
  );
}

export default TripDetailsPage;
