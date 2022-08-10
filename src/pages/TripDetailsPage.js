import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
// import { useAccount } from "../context/authContext";

import {
    Container,
    Button,
    CircularProgress
} from "@mui/material";
import { Edit } from "@mui/icons-material";

import Page from "../components/common/Page";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading"
import TripList from "../components/trip/TripList";

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

function TripDetailsPage() {
    //   const { user } = useAccount();
    const { id } = useParams()

    const [trip, setTrip] = useState(null)

    const { data, loading } = useQuery(GET_TRIP, {
        variables: { id }
    });

    useEffect(() => {
        if (data) setTrip(data.getTrip)
    }, [data])

    return (
        <Page title="Trip Details">
            <Container>
                {loading && (
                    <Loading />
                )}
                {!loading && trip && (
                    <>
                        <PageHeader
                            type="button"
                            title={trip.title}
                            button={
                                <Button variant="contained" component={RouterLink} to={`/dashboard/trips/${id}/update`} startIcon={<Edit />}>
                                    Edit
                                </Button>
                            }
                        />
                        {console.log(data)}
                        <ul>
                            <li>{trip.id}</li>
                            <li>{trip.title}</li>
                            <li>{trip.createdBy}</li>
                            <li>{trip.createdAt}</li>
                            <li>{trip.departureDate}</li>
                            <li>{trip.returnDate}</li>
                            <li>{trip.location}</li>

                            {trip.participants.map(p => {
                                return (
                                    <li key={p.id}>
                                        {p.firstName} {p.lastName}
                                    </li>
                                )
                            })}

                            <li>{trip.tripStatus}</li>
                            <li>{trip.updatedAt}</li>
                        </ul>
                    </>
                )}
            </Container>
        </Page>
    );
}

export default TripDetailsPage;
