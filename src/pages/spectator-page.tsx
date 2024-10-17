import { Alert, Box, Snackbar } from '@mui/material';
import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { socket } from '@shared/utils/socket';
import { useState, useEffect } from 'react';
import InProgressQueue from '@modules/Queue/in-progress-queue';
import { playNotificationSound } from '@shared/utils/speech';

const OperatorPage = () => {
    const [inProgressTickets, setInProgressTickets] = useState<
        {
            windowNumber: string;
            ticketNumber: string;
        }[]
    >();

    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');
    const { departmentId: departmentIdAuth } = useAuth();

    useEffect(() => {
        socket.emit('join-department', departmentIdAuth);

        socket.on('specialist-available', (data) => {
            const { windowNumber } = data;
            setInProgressTickets((prev = []) => {
                return prev.filter((t) => t.windowNumber !== windowNumber);
            });
        });

        socket.on('take-pause-specialist', (data) => {
            const { windowNumber } = data;
            setInProgressTickets((prev = []) => {
                return prev.filter(
                    (item) => item.windowNumber !== windowNumber,
                );
            });
        });

        socket.on('logout-specialist-frontend', (data) => {
            const { windowNumber } = data;
            console.log(windowNumber);
            setInProgressTickets((prev = []) => {
                return prev.filter(
                    (item) => item.windowNumber !== windowNumber,
                );
            });
        });

        socket.on('ticket-in-progress', (data) => {
            const { ticket, windowNumber } = data;

            setInProgressTickets((prev = []) => {
                let updatedItem = prev.find(
                    (item) => item.windowNumber === windowNumber,
                );

                if (!updatedItem) {
                    updatedItem = {
                        windowNumber: windowNumber,
                        ticketNumber: ticket.ticketNumber,
                    };
                }

                if (updatedItem) {
                    updatedItem.ticketNumber = ticket.ticketNumber;
                }

                const newArray = [
                    ...(updatedItem ? [updatedItem] : []),
                    ...prev.filter(
                        (item) => item.windowNumber !== windowNumber,
                    ),
                ];

                playNotificationSound();

                return newArray;
            });
        });

        return () => {
            socket.off('ticket-added');
            socket.off('ticket-in-progress');
            socket.off('logout-specialist-frontend');
            socket.off('take-pause-specialist');
            socket.off('specialist-available');
        };
    }, []);

    useEffect(() => {
        getAllWaitingQueues();
    }, []);

    const getAllWaitingQueues = async () => {
        try {
            const response = await instance.get(`queues/${departmentIdAuth}`);

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить данные. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } else {
                setInProgressTickets(response.data.inProgressTickets);
            }
        } catch (error) {
            setSnackbarMessage('Ошибка при загрузке данных');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    paddingTop: '30px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <InProgressQueue items={inProgressTickets} />
                </Box>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default OperatorPage;
