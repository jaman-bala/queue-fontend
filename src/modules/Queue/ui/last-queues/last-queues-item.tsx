import { Box, Typography } from '@mui/material';

interface LastQueueItemProps {
    ticketNumber: string;
    isLast?: boolean;
}

export const LastQueueItem = (props: LastQueueItemProps) => {
    const { ticketNumber, isLast = false, ...otherProps } = props;
    return (
        <Box
            sx={{
                width: '200px',
                height: '130px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: '#fff',
                marginRight: !isLast ? '10px' : '0',
            }}
            {...otherProps}
        >
            <Typography fontWeight={600}>{ticketNumber}</Typography>
        </Box>
    );
};
