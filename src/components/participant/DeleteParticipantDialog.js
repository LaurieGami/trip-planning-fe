import { gql, useMutation } from "@apollo/client";

import {
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

const DELETE_PARTICIPANT = gql`
  mutation DeleteParticipant($id: ID!) {
    deleteParticipant(id: $id) {
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

function DeleteParticipantDialog({ participant, userId, open, handleClose }) {
  const { id, firstName, lastName } = participant;

  const [deleteParticipant, { loading, error }] = useMutation(
    DELETE_PARTICIPANT,
    {
      variables: { id },
      update(cache, { data: { deleteParticipant } }) {
        const { getParticipants } = cache.readQuery({
          query: GET_PARTICIPANTS,
          variables: { userId },
        });
        cache.writeQuery({
          query: GET_PARTICIPANTS,
          variables: { userId },
          data: {
            getParticipants: getParticipants.filter(
              (p) => p.id !== deleteParticipant.id
            ),
          },
        });
      },
      onCompleted({ deleteParticipant }) {
        console.log("DELETED", deleteParticipant);
      },
    }
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
      <DialogTitle sx={{ pt: 3 }}>Delete Participant</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure you want to delete ${firstName} ${lastName}?`}
        </DialogContentText>
      </DialogContent>
      {error && (
        <Box sx={{ px: 3 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      )}
      <DialogActions sx={{ pt: 1, px: 3, pb: 3 }}>
        <Button onClick={() => handleClose(false)}>Cancel</Button>
        <LoadingButton
          color="primary"
          variant="contained"
          loading={loading}
          onClick={() => deleteParticipant({ variables: { id } })}
        >
          Delete Participant
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteParticipantDialog;
