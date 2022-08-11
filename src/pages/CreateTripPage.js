import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../context/authContext";

import { Container } from "@mui/material";

import Page from "../components/common/Page";
import PageHeader from "../components/common/PageHeader";
import TripForm from "../components/form/TripForm";

const CREATE_TRIP = gql`
  mutation CreateTrip($tripCreationInput: TripCreationInput) {
    createTrip(tripCreationInput: $tripCreationInput) {
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

function CreateTripPage() {
  let navigate = useNavigate();
  const { user } = useAccount();

  const [createTrip, { loading, error }] = useMutation(CREATE_TRIP, {
    onCompleted({ createTrip }) {
      const { id } = createTrip;
      navigate(`/dashboard/trips/${id}`);
    },
  });

  function handleCreate(values) {
    const tripCreationInput = {
      ...values,
      createdBy: user.id,
      participants:
        values.participants.length > 0
          ? values.participants.map((p) => p.id)
          : null,
    };
    createTrip({ variables: { tripCreationInput } });
  }

  return (
    <Page title="Create Trip">
      <Container>
        <PageHeader
          title="Create Trip"
          subtitle="Fill the form below to create a trip."
        />
        <TripForm
          type="create"
          tripValues={{
            title: "",
            location: "",
            departureDate: null,
            returnDate: null,
            participants: [],
          }}
          handleSubmit={handleCreate}
          loading={loading}
          error={error}
        />
      </Container>
    </Page>
  );
}

export default CreateTripPage;
