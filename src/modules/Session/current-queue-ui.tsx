import { Box, Typography } from '@mui/material';
import { formattedDate } from '@shared/utils/date-helpers';

interface CurrentQueueProps {
    ticket?: string | null;
    createdAt?: string;
}

const CurrentQueue = (props: CurrentQueueProps) => {
    let { ticket, createdAt } = props;

    let content = ticket || 'Пока нет клиентов';
    if (createdAt) {
        createdAt = formattedDate(createdAt);
    }

    return (
        <Box
            sx={{
                backgroundColor: '#1976d2',
                padding: '40px',
                width: '250px',
                borderRadius: '10px',
                mt: '20px',
                mr: 'auto',
                ml: 'auto',
            }}
        >
            <Typography
                sx={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: 600,
                }}
            >
                {content}
            </Typography>
            {createdAt && (
                <Typography
                    sx={{
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 400,
                    }}
                >
                    {createdAt}
                </Typography>
            )}
        </Box>
    );
};

export default CurrentQueue;
