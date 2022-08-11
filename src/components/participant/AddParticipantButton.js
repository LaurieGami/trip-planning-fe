import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { sortBy } from "lodash";

import {
  TextField,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";

const participantSchema = yup.object({
  firstName: yup
    .string("Enter participant's first name")
    .required("First Name is required"),
  lastName: yup
    .string("Enter participant's last name")
    .required("Last Name is required"),
});

const CREATE_PARTICIPANT = gql`
  mutation CreateParticipant($participantInput: ParticipantInput) {
    createParticipant(participantInput: $participantInput) {
      id
      firstName
      lastName
    }
  }
`;

const GET_PARTICIPANTS = gql`
  query GetParticipants($userId: ID!) {
    getParticipants(userId: $userId) {
      id
      firstName
      lastName
    }
  }
`;

function AddParticipantButton({ userId }) {
  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    toggleOpen(false);
  };

  const [createParticipant, { loading, error }] = useMutation(
    CREATE_PARTICIPANT,
    {
      update(cache, { data: { createParticipant } }) {
        console.log(cache.data.data)
        const { getParticipants } = cache.readQuery({ query: GET_PARTICIPANTS, variables: { userId } });
        cache.writeQuery({
          query: GET_PARTICIPANTS,
          variables: { userId },
          data: { getParticipants: sortBy([ ...getParticipants, createParticipant ], ['firstName']) },
        });
      }
    }
  );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<Add />}
          onClick={() => toggleOpen(true)}
        >
          New Participant
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
          }}
          validationSchema={participantSchema}
          onSubmit={(values) => {
            createParticipant({
              variables: { participantInput: { ...values, userId } },
            });
            handleClose();
          }}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form>
              <DialogTitle>Add New Participant</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Did you miss someone? Please, add them!
                </DialogContentText>
                <Stack spacing={2} sx={{ paddingTop: "8px" }}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Stack>
              </DialogContent>
              <DialogActions sx={{ padding: "8px 24px 16px" }}>
                <Button onClick={handleClose}>Cancel</Button>
                <LoadingButton
                  color="primary"
                  variant="contained"
                  loading={loading}
                  type="submit"
                >
                  Add Participant
                </LoadingButton>
                {error && <Alert severity="error">{error.message}</Alert>}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default AddParticipantButton;
