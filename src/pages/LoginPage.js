import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "../context/authContext";
import { useFormik } from "formik";
import * as yup from "yup";

import {
  TextField,
  Button,
  Container,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import Page from "../components/common/Page";

const loginSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      id
      email
      username
      token
    }
  }
`;

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  let { login, user } = useAccount();
  let navigate = useNavigate();
  let location = useLocation();

  let from = location.state?.from?.pathname || "/dashboard";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      loginUser({ variables: { loginInput: values } });
    },
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted({ loginUser }) {
      login(loginUser);
      navigate(from, { replace: true });
    },
  });

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <Page title="Login">
      <Container>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Login with the form below to access your account.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} paddingBottom={2}>
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
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
              Login
            </Button>
            {loading && <Alert severity="info">Logging in user...</Alert>}
            {error && <Alert severity="error">{error.message}</Alert>}
          </Stack>
        </form>
      </Container>
    </Page>
  );
}

export default LoginPage;
