import { Box, Skeleton } from '@mui/material';

export const LastQueuesSkeleton = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                padding: '20px',
                background: '#519FE8',
                borderRadius: '10px',
            }}
        >
            <Skeleton
                variant="rounded"
                width={200}
                height={130}
                sx={{ marginRight: '10px' }}
            />
            <Skeleton
                variant="rounded"
                width={200}
                height={130}
                sx={{ marginRight: '10px' }}
            />
            <Skeleton
                variant="rounded"
                width={200}
                height={130}
                sx={{ marginRight: '10px' }}
            />
            <Skeleton variant="rounded" width={200} height={130} />
        </Box>
    );
};
