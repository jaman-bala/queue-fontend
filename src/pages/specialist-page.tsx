import CompleteQueue from '@modules/Session/complete-queue-ui';
import CurrentQueue from '@modules/Session/current-queue-ui';
// import TakeBreake from '@modules/Session/take-breake-ui';
import { Alert, Box, Divider, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { socket } from '@shared/utils/socket';
import { QueueResponse } from '@shared/utils/types';
import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { AxiosError } from 'axios';

const SpecialistPage = () => {
    const [currentQueue, setCurrentQueue] = useState<QueueResponse | null>();
    const [responseLoading, setResponseLoading] = useState<boolean>(false);

    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');
    const { sessionId, departmentId, ticketsType, windowNumber, username } =
        useAuth();
    const getCurrentQueue = async () => {
        setResponseLoading(true);

        try {
            const response = await instance.get(
                `queues/specialist/${sessionId}`,
            );

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить данные. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setResponseLoading(false);
            } else {
                if (response.data.next) {
                    socket.emit('continue-work', { sessionId, departmentId });
                } else {
                    setCurrentQueue(response.data.queue);
                }
                setSnackbarMessage('Следуйщий клиент');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setResponseLoading(false);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log('Error data ' + error);
                setSnackbarMessage(error.response?.data.message);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setResponseLoading(false);
            }
        }
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const handleNextTicket = () => {
        setResponseLoading(true);
        socket.emit('complete-ticket', {
            sessionId,
            departmentId,
            ticketsType,
        });
    };

    useEffect(() => {
        socket.emit('join-department', departmentId);
        socket.emit('join-session', sessionId);
        socket.on('ticket-in-progress-spec', (data) => {
            const { ticket } = data;
            setCurrentQueue(ticket);
            setSnackbarMessage('Следуйщий клиент');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setResponseLoading(false);
        });
        socket.on('specialist-available-spec', (data) => {
            console.log(data);
            setCurrentQueue(null);
            setResponseLoading(false);
        });

        return () => {
            socket.off('ticket-in-progress-spec');
            socket.off('specialist-available-spec');
        };
    }, []);

    useEffect(() => {
        getCurrentQueue();
    }, []);
    return (
        <>
            <Box
                sx={{
                    boxShadow: '2px 2px 10px 2px ',
                    width: '500px',
                    margin: '100px auto',
                    padding: '20px',
                    borderRadius: '10px',
                }}
            >
                <Typography sx={{ fontSize: '24px' }}>
                    Окно:{' '}
                    <span style={{ fontWeight: 600 }}>{windowNumber}</span>
                </Typography>
                <Typography sx={{ fontSize: '24px' }}>
                    Специалист:{' '}
                    <span style={{ fontWeight: 600 }}>{username}</span>
                </Typography>
                <CurrentQueue
                    ticket={currentQueue?.ticketNumber}
                    createdAt={currentQueue?.createdAt}
                />
                <Divider sx={{ mt: '30px' }} />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: '30px',
                    }}
                >
                    {/* <TakeBreake loading={responseLoading} /> */}
                    <CompleteQueue
                        loading={responseLoading}
                        onClickNext={handleNextTicket}
                        ticket={currentQueue?.ticketNumber}
                    />
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

export default SpecialistPage;
