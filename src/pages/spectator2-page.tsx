import { useEffect } from 'react';
import { TicketList } from '@modules/Ticket/ui/ticket-list';
import { Box } from '@mui/material';

export const SpectatorPage = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            window.location.reload();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100dvh',
            }}
        >
            <TicketList />
        </Box>
    );
};
