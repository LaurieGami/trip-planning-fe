import PropTypes from "prop-types";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useAccount } from "../../context/authContext";
import { sortBy } from "lodash";

import {
  TextField,
  Stack,
  Autocomplete,
  Alert,
  Button,
  Box,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import AddParticipantButton from "../participant/AddParticipantButton";

const tripStatuses = ["draft", "active", "completed", "overdue"];

const tripSchema = yup.object({
  title: yup
    .string()
    .min(8, "Trip Title must be at least 8 characters")
    .max(50, "Trip Title must not belonger than 50 characters")
    .required("Required"),
  location: yup.string(),
  departureDate: yup
    .date()
    .min(new Date(), "Departure Date must be in the future")
    .nullable(),
  returnDate: yup
    .date()
    .min(
      yup.ref("departureDate"),
      "Return Date must be later than Departure Date"
    )
    .nullable(),
  participants: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      firstName: yup.string().min(2, "Too short").max(50, "Too long"),
      lastName: yup.string().min(2, "Too short").max(50, "Too long"),
    })
  ),
  tripStatus: yup.string().oneOf(tripStatuses),
});

const GET_PARTICIPANTS = gql`
  query GetParticipants($userId: ID!) {
    getParticipants(userId: $userId) {
      id
      firstName
      lastName
    }
  }
`;

function TripForm({
  type = "create",
  tripValues,
  handleSubmit,
  setEditing = () => {},
  loading,
  error,
}) {
  const { user } = useAccount();

  const [participants, setParticipants] = useState([]);

  useQuery(GET_PARTICIPANTS, {
    variables: { userId: user.id },
    onCompleted({ getParticipants }) {
      setParticipants(sortBy(getParticipants, ["firstName"]));
    },
  });

  return (
    <Formik
      initialValues={tripValues}
      validationSchema={tripSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({
        values,
        handleChange,
        setFieldValue,
        errors,
        touched,
        resetForm,
      }) => (
        <Form>
          <Stack spacing={2} paddingBottom={2}>
            <TextField
              fullWidth
              required
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
                onChange={(value) => setFieldValue("departureDate", value)}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    label="Departure Date & Time"
                    onChange={handleChange}
                    error={
                      touched.departureDate && Boolean(errors.departureDate)
                    }
                    helperText={touched.departureDate && errors.departureDate}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                fullWidth
                id="returnDate"
                name="returnDate"
                value={values.returnDate}
                onChange={(value) => setFieldValue("returnDate", value)}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    label="Return Date & Time"
                    onChange={handleChange}
                    error={touched.returnDate && Boolean(errors.returnDate)}
                    helperText={touched.returnDate && errors.returnDate}
                  />
                )}
              />
            </LocalizationProvider>
            <AddParticipantButton userId={user.id} />
            <Autocomplete
              multiple
              id="participants"
              name="participants"
              options={participants}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
              value={values.participants}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_event, value) => {
                setFieldValue("participants", value);
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth label="Participants" />
              )}
            />
            <FormControl fullWidth>
              <InputLabel id="tripStatusLabel">Trip Status</InputLabel>
              <Select
                labelId="tripStatusLabel"
                id="tripStatus"
                name="tripStatus"
                value={values.tripStatus}
                label="Trip Status"
                onChange={(event) => {
                  const { value } = event.target;
                  setFieldValue("tripStatus", value);
                }}
              >
                {tripStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error && <Alert severity="error">{error.message}</Alert>}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                sx={{ mr: 2 }}
                onClick={() => {
                  resetForm();
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                color="primary"
                variant="contained"
                loading={loading}
                type="submit"
              >
                {type === "create" ? "Create Trip" : "Update Trip"}
              </LoadingButton>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

TripForm.propTypes = {
  type: PropTypes.oneOf(["create", "update"]),
  tripValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setEditing: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.object,
};

export default TripForm;
