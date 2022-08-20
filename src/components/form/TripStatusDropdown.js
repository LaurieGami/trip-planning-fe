import PropTypes from "prop-types";

import {
    Typography,
    Box,
    Alert,
    Link,
    CircularProgress
} from "@mui/material";

import Label from "../common/Label";

const tripStatuses = ["draft", "active", "completed"];

const tripStatusesColor = {
    draft: "secondary",
    active: "primary",
    completed: "success",
    overdue: "error",
};

function TripStatusDropdown({
    tripStatus,
    handleStatusUpdate,
    loading,
    error,
}) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="body1">Mark this trip as:</Typography>
                {tripStatuses
                    .filter(s => s !== tripStatus)
                    .map((status) => (
                        <Link
                            key={status}
                            sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                            onClick={() => handleStatusUpdate(status)}
                        >
                            <Label
                                variant="filled"
                                color={tripStatusesColor[status] || "info"}
                                sx={{
                                    textTransform: "uppercase",
                                    cursor: 'pointer'
                                }}
                            >
                                {status}
                            </Label>
                        </Link>
                    ))
                }
                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: 'hidden',
                            height: 20,
                            width: 20
                        }}
                    >
                        <CircularProgress size={20} />
                    </Box>
                )}

            </Box>
            {error && <Alert severity="error">{error.message}</Alert>}
        </Box>
    );
}

TripStatusDropdown.propTypes = {
    tripStatus: PropTypes.string.isRequired,
    handleStatusUpdate: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.object,
};

export default TripStatusDropdown;
