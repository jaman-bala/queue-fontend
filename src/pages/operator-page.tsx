import AddQueue from '@modules/Queue/add-queue-ui';
import QueueCards from '@modules/Queue/queue-cards-ui';
import { Alert, Box, Snackbar } from '@mui/material';
import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { socket } from '@shared/utils/socket';
import { useState, useEffect, useContext } from 'react';
import { QueueResponse } from '@shared/utils/types';
import { useNavigate } from 'react-router-dom';
import { PrintContext } from '@app/providers/print-provider/print-provider';
import { formattedDate } from '@shared/utils/date-helpers';
import { QueuesTypes } from '@shared/types/queues-types';

const OperatorPage = () => {
    const [ticketsTsF, setTicketsTsF] = useState<string[]>([]);
    const [ticketsVs, setTicketsVs] = useState<string[]>([]);
    const [ticketsGr, setTicketsGr] = useState<string[]>([]);
    const [ticketsTsY, setTicketsTsY] = useState<string[]>([]);
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const { setPrintData } = useContext(PrintContext);

    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');
    const { departmentId: departmentIdAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('join-department', departmentIdAuth);
        socket.on('ticket-added', (data) => {
            const { ticket } = data;
            if (ticket.type === 'TSY') {
                setTicketsTsY((prev) => [...prev, ticket.ticketNumber]);
            } else if (ticket.type === 'TSF') {
                setTicketsTsF((prev) => [...prev, ticket.ticketNumber]);
            } else if (ticket.type === 'GR') {
                setTicketsGr((prev) => [...prev, ticket.ticketNumber]);
            } else if (ticket.type === 'VS') {
                setTicketsVs((prev) => [...prev, ticket.ticketNumber]);
            }
            if (setPrintData) {
                setPrintData({
                    ticket: data.ticket.ticketNumber,
                    departmentName: data.departmentName,
                    createdAt: formattedDate(data.ticket.createdAt),
                });
            }
            navigate('/print');
            setResponseLoading(false);
        });

        socket.on('ticket-in-progress', (data) => {
            const { ticket, departmentName, hasQueues } = data;
            if (ticket.type === 'TSY') {
                setTicketsTsY((prev) =>
                    prev.filter((t) => t !== ticket.ticketNumber),
                );
            } else if (ticket.type === 'TSF') {
                setTicketsTsF((prev) =>
                    prev.filter((t) => t !== ticket.ticketNumber),
                );
            } else if (ticket.type === 'GR') {
                setTicketsGr((prev) =>
                    prev.filter((t) => t !== ticket.ticketNumber),
                );
            } else if (ticket.type === 'VS') {
                setTicketsVs((prev) =>
                    prev.filter((t) => t !== ticket.ticketNumber),
                );
            }
            setResponseLoading(false);
            if (hasQueues) {
                if (setPrintData) {
                    setPrintData({
                        ticket: data.ticket.ticketNumber,
                        departmentName: departmentName,
                        createdAt: formattedDate(data.ticket.createdAt),
                    });
                }
                navigate('/print');
            }
        });

        return () => {
            socket.off('ticket-added');
            socket.off('ticket-in-progress');
        };
    }, []);

    useEffect(() => {
        getAllWaitingQueues();
    }, []);

    const getAllWaitingQueues = async () => {
        setResponseLoading(true);
        try {
            const response = await instance.get(`queues/${departmentIdAuth}`);
            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить данные. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setResponseLoading(false);
            } else {
                console.log(response);
                const ticketNumbersTsF = response.data.tsFTickets.map(
                    (ticket: QueueResponse) => ticket.ticketNumber,
                );
                const ticketNumbersTsY = response.data.tsYTickets.map(
                    (ticket: QueueResponse) => ticket.ticketNumber,
                );
                const ticketNumbersGr = response.data.grTickets.map(
                    (ticket: QueueResponse) => ticket.ticketNumber,
                );
                const ticketNumbersVs = response.data.vsTickets.map(
                    (ticket: QueueResponse) => ticket.ticketNumber,
                );
                setTicketsTsF(ticketNumbersTsF);
                setTicketsTsY(ticketNumbersTsY);
                setTicketsGr(ticketNumbersGr);
                setTicketsVs(ticketNumbersVs);
                setResponseLoading(false);
            }
        } catch (error) {
            setTicketsTsF([]);
            setTicketsTsY([]);
            setTicketsGr([]);
            setTicketsVs([]);
            console.log(error);
            setSnackbarMessage('Ошибка при загрузке данных');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setResponseLoading(false);
        }
    };

    const handleAddQueue = (ticketType: QueuesTypes) => {
        setResponseLoading(true);
        const departmentId = departmentIdAuth;
        socket.emit('add-new-ticket', {
            departmentId,
            ticketType,
        });
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
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <AddQueue
                        ticketType="TSF"
                        onAddQueue={handleAddQueue}
                        loading={responseLoading}
                    ></AddQueue>
                    <QueueCards items={ticketsTsF} ticketType="ТС-Ф" />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <AddQueue
                        ticketType="TSY"
                        onAddQueue={handleAddQueue}
                        loading={responseLoading}
                    ></AddQueue>
                    <QueueCards items={ticketsTsY} ticketType="ТС-Ю" />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <AddQueue
                        ticketType="GR"
                        onAddQueue={handleAddQueue}
                        loading={responseLoading}
                    ></AddQueue>
                    <QueueCards items={ticketsGr} ticketType="ГР" />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <AddQueue
                        ticketType="VS"
                        onAddQueue={handleAddQueue}
                        loading={responseLoading}
                    ></AddQueue>
                    <QueueCards items={ticketsVs} ticketType="ВС" />
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
