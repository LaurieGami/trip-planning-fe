import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '../common/Label';

const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

function TripCard({ trip }) {
    const {
        id,
        title,
        createdAt,
        departureDate,
        returnDate,
        location,
        participants,
        tripStatus,
        updatedAt,
        cover
    } = trip;

    return (
        <Card>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                {tripStatus && (
                    <Label
                        variant="filled"
                        color={(tripStatus === 'overdue' && 'error') || 'info'}
                        sx={{
                            zIndex: 9,
                            top: 16,
                            right: 16,
                            position: 'absolute',
                            textTransform: 'uppercase',
                        }}
                    >
                        {tripStatus}
                    </Label>
                )}
                <ProductImgStyle alt={title} src={cover ? cover : '/static/default-images/trip.jpg'} />
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
                <Typography variant="subtitle2" noWrap>
                    {location}
                </Typography>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Link to={`/dashboard/trips/${id}`} color="inherit" underline="hover" component={RouterLink}>
                        <Typography variant="subtitle1">
                            {title}
                        </Typography>
                    </Link>
                </Stack>
            </Stack>
        </Card>
    );
}

TripCard.propTypes = {
    trip: PropTypes.object,
};

export default TripCard