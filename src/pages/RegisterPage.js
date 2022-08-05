import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { TextField, Button, Container, Stack, Alert } from '@mui/material'

const registerSchema = yup.object({
    username: yup
        .string('Enter your username')
        .min(8, 'Username should be of minimum 8 characters length')
        .required('Username is required'),
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    confirmPassword: yup
        .string('Confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
})

const REGISTER_USER = gql`
    mutation RegisterUser($registerInput: RegisterInput) {
        registerUser(registerInput: $registerInput) {
            email
            username
            token
        }
    }
`

function RegisterPage() {
    const context = useContext(AuthContext)
    let navigate = useNavigate()
    const [errors, setErrors] = useState([])

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: registerSchema,
        onSubmit: (values) => {
            registerUser({ variables: { registerInput: values } })
        }
    })

    const [registerUser, { data, loading }] = useMutation(REGISTER_USER, {
        onError({ graphQLErrors, networkError }) {
            if (graphQLErrors) {
                graphQLErrors.map(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                    )
                )
                setErrors(graphQLErrors)
            }
            if (networkError) console.log(`[Network error]: ${networkError}`)
        }
    })

    useEffect(() => {
        if (data) {
            const { registerUser } = data
            context.login(registerUser)
            navigate('/')
        }
    }, [data])

    return (
        <Container spacing={2} maxWidth="sm">
            <h3>Register</h3>
            <p>This is the register page, register below to create an account</p>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2} paddingBottom={2}>
                    <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Button color="primary" variant="contained" fullWidth type="submit">
                        Register
                    </Button>
                    {loading && (
                        <Alert severity="info">Registering new user...</Alert>
                    )}
                    {errors.map((error, i) => {
                        return (
                            <Alert key={`error-${i}`} severity="error">{error.message}</Alert>
                        )
                    })}
                </Stack>
            </form>
        </Container>
    )
}

export default RegisterPage
