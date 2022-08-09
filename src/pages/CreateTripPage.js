import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
// import { useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import useAccount from '../hooks/useAccount'

import { TextField, Container, Stack, Autocomplete, Alert, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import AddParticipantButton from '../components/participant/AddParticipantButton'

const tripSchema = yup.object({
    title: yup.string()
        .min(8, 'Trip Title must be at least 8 characters')
        .max(50, 'Trip Title must not belonger than 50 characters')
        .required('Required'),
    location: yup.string(),
    departureDate: yup.date()
        .min(new Date(), 'Departure Date must be in the future')
        .nullable(),
    returnDate: yup.date()
        .min(yup.ref('departureDate'), 'Return Date must be later than Departure Date')
        .nullable(),
    participants: yup.array()
        .of(
            yup.object().shape({
                id: yup.string(),
                firstName: yup.string().min(2, 'Too short').max(50, 'Too long'),
                lastName: yup.string().min(2, 'Too short').max(50, 'Too long'),
            })
        )
})

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
`

const GET_PARTICIPANTS = gql`
    query GetParticipants($userId: ID!) {
        getParticipants(userId: $userId) {
            id
            firstName
            lastName
        }
    }
`

function CreateTripPage() {
    // let navigate = useNavigate()
    const { user } = useAccount()

    const [participants, setParticipants] = useState([])

    useQuery(GET_PARTICIPANTS, {
        variables: { userId: user.id },
        onCompleted({ getParticipants }) {
            setParticipants(getParticipants.map(participant => {
                return {
                    id: participant.id,
                    firstName: participant.firstName,
                    lastName: participant.lastName
                }
            }))
        }
    })

    const [createTrip, { loading, error }] = useMutation(CREATE_TRIP, {
        onCompleted({ createTrip }) {
            console.log('createTrip', createTrip)
            // navigate('/')
        }
    })

    return (
        <Container>
            <Stack direction="row" alignItems="baseline" justifyContent="flex-start" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Create Trip
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                    This is the place where you create a trip!
                </Typography>
            </Stack>
            <Formik
                initialValues={{
                    title: '',
                    location: '',
                    departureDate: null,
                    returnDate: null,
                    participants: []
                }}
                validationSchema={tripSchema}
                onSubmit={values => {
                    const tripCreationInput = {
                        ...values,
                        createdBy: user.id,
                        participants: values.participants.map(p => p.id)
                    }
                    createTrip({ variables: { tripCreationInput } })
                }}
            >
                {({ values, handleChange, setFieldValue, errors, touched }) => (
                    <Form>
                        <Stack spacing={2} paddingBottom={2}>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                label="Title"
                                value={values.title}
                                onChange={handleChange}
                                error={touched.title && Boolean(errors.title)}
                                helperText={touched.title && errors.title}
                            />
                            <TextField
                                fullWidth
                                id="location"
                                name="location"
                                label="Location"
                                value={values.location}
                                onChange={handleChange}
                                error={touched.location && Boolean(errors.location)}
                                helperText={touched.location && errors.location}
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    fullWidth
                                    id="departureDate"
                                    name="departureDate"
                                    value={values.departureDate}
                                    onChange={value => setFieldValue('departureDate', value)}
                                    renderInput={(props) => <TextField
                                        {...props}
                                        label="Departure Date & Time"
                                        onChange={handleChange}
                                        error={touched.departureDate && Boolean(errors.departureDate)}
                                        helperText={touched.departureDate && errors.departureDate}
                                    />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    fullWidth
                                    id="returnDate"
                                    name="returnDate"
                                    value={values.returnDate}
                                    onChange={value => setFieldValue('returnDate', value)}
                                    renderInput={(props) => <TextField
                                        {...props}
                                        label="Return Date & Time"
                                        onChange={handleChange}
                                        error={touched.returnDate && Boolean(errors.returnDate)}
                                        helperText={touched.returnDate && errors.returnDate}
                                    />}
                                />
                            </LocalizationProvider>
                            <AddParticipantButton userId={user.id} />
                            <Autocomplete
                                multiple
                                id="participants"
                                name="participants"
                                options={participants}
                                getOptionLabel={(option) => option.firstName}
                                onChange={(_event, value) => {
                                    setFieldValue('participants', value)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Participants"
                                    />
                                )}
                            />
                            <LoadingButton
                                fullWidth
                                color="primary"
                                variant="contained"
                                loading={loading}
                                type="submit"
                            >
                                Create Trip
                            </LoadingButton>
                            {error && (
                                <Alert severity="error">{error.message}</Alert>
                            )}
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Container>
    )
}

export default CreateTripPage
