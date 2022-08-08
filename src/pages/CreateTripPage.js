import { useContext, useState } from 'react'
import { AuthContext } from '../context/authContext'
import { gql, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import useAccount from '../hooks/useAccount'

import { TextField, Button, Container, Stack, Alert, Autocomplete, createFilterOptions } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import MultiSelectAutocomplete from '../components/form/MultiSelectAutocomplete'

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
            yup.string()
            // yup.object().shape({
            //     firstName: yup.string().min(2, 'Too short').max(50, 'Too long'),
            //     lastName: yup.string().min(2, 'Too short').max(50, 'Too long'),
            //     email: yup.string().email('Invalid email'),
            //     phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
            // })
        )
})

// const REGISTER_USER = gql`
//     mutation RegisterUser($registerInput: RegisterInput) {
//         registerUser(registerInput: $registerInput) {
//             email
//             username
//             token
//         }
//     }
// `

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
    const context = useContext(AuthContext)
    let navigate = useNavigate()
    const { user } = useAccount()

    const [participants, setParticipants] = useState([])

    const formik = useFormik({
        initialValues: {
            title: '',
            location: '',
            departureDate: null,
            returnDate: null,
            participants: []
        },
        validationSchema: tripSchema,
        onSubmit: (values) => {
            console.log(values)
            // registerUser({ variables: { registerInput: values } })
        }
    })

    // const [registerUser, { loading, error }] = useMutation(REGISTER_USER, {
    //     onCompleted({ registerUser }) {
    //         context.login(registerUser)
    //         navigate('/')
    //     }
    // })

    const { loading, error } = useQuery(GET_PARTICIPANTS, {
        variables: { userId: user.id },
        onCompleted({ getParticipants }) {
            setParticipants(getParticipants)
        }
    })

    return (
        <Container spacing={2} maxWidth="sm">
            <h3>Create Trip</h3>
            <p>This is the place where you create a trip!</p>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2} paddingBottom={2}>
                    <TextField
                        fullWidth
                        id="title"
                        name="title"
                        label="Title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />
                    <TextField
                        fullWidth
                        id="location"
                        name="location"
                        label="Location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        error={formik.touched.location && Boolean(formik.errors.location)}
                        helperText={formik.touched.location && formik.errors.location}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            fullWidth
                            id="departureDate"
                            name="departureDate"
                            value={formik.values.departureDate}
                            onChange={value => formik.setFieldValue('departureDate', value)}
                            renderInput={(props) => <TextField
                                {...props}
                                label="Departure Date & Time"
                                onChange={formik.handleChange}
                                error={formik.touched.departureDate && Boolean(formik.errors.departureDate)}
                                helperText={formik.touched.departureDate && formik.errors.departureDate}
                            />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            fullWidth
                            id="returnDate"
                            name="returnDate"
                            value={formik.values.returnDate}
                            onChange={value => formik.setFieldValue('returnDate', value)}
                            renderInput={(props) => <TextField
                                {...props}
                                label="Return Date & Time"
                                onChange={formik.handleChange}
                                error={formik.touched.returnDate && Boolean(formik.errors.returnDate)}
                                helperText={formik.touched.returnDate && formik.errors.returnDate}
                            />}
                        />
                    </LocalizationProvider>

                    {/* <Autocomplete
                        multiple
                        fullWidth
                        id="participants"
                        name="participants"
                        options={participants}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        // getOptionLabel={(option) => {
                        //     // Value selected with enter, right from the input
                        //     if (typeof option === 'string') {
                        //         return option;
                        //     }
                        //     // Add "xxx" option created dynamically
                        //     if (option.inputValue) {
                        //         return option.inputValue;
                        //     }
                        //     // Regular option
                        //     return `${option.firstName} ${option.lastName}`;
                        // }}
                        filterOptions={(options, params) => {
                            const filter = createFilterOptions();
                            const filtered = filter(options, params);

                            console.log('options', options)
                            console.log('params', params)
                            console.log('filtered', filtered)

                            if (params.inputValue !== '') {
                                filtered.push({
                                    firstName: `Add "${params.inputValue}"`,
                                    lastName: ''
                                });
                            }

                            return filtered;
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Participants"
                                onChange={formik.handleChange}
                                error={formik.touched.participants && Boolean(formik.errors.participants)}
                                helperText={formik.touched.participants && formik.errors.participants}
                            />
                        )}
                    /> */}

                    {participants.length > 0 &&
                        (<MultiSelectAutocomplete
                            options={participants}
                            keys={['firstName', 'lastName']}
                            // onChange={formik.handleChange}
                            // error={formik.touched.participants && Boolean(formik.errors.participants)}
                            // helperText={formik.touched.participants && formik.errors.participants}
                        />
                    )}

                    <Button color="primary" variant="contained" fullWidth type="submit">
                        Create Trip
                    </Button>
                    {/* {loading && (
                        <Alert severity="info">Creating trip...</Alert>
                    )}
                    {error && (
                        <Alert severity="error">{error.message}</Alert>
                    )} */}
                </Stack>
            </form>
        </Container>
    )
}

export default CreateTripPage
