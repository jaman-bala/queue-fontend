import { Box, Typography } from '@mui/material';
import TicketItem from './ticket-item';
import cls from './ticket-list.module.scss';
import useAuth from '@shared/hooks/useAuth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@shared/types/redux-types';
import {
    deleteInProgressTicket,
    getInProgressQueues,
    updateInProgressTickets,
} from '../model/inprogress-tickets-slice';
import { socket } from '@shared/utils/socket';

export const TicketList = () => {
    const { departmentId } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const tickets = useSelector(
        (state: RootState) => state.inProgressTickets.tickets,
    );
    const status = useSelector(
        (state: RootState) => state.inProgressTickets.status,
    );
    const error = useSelector(
        (state: RootState) => state.inProgressTickets.error,
    );

    const success = status === 'succeeded';
    const failed = status === 'failed';
    const errorMessage =
        typeof error === 'string' ? (
            <Typography align="center" fontWeight={600} variant="h5">
                {error}
            </Typography>
        ) : null;

    useEffect(() => {
        dispatch(getInProgressQueues(departmentId));
    }, []);

    useEffect(() => {
        socket.emit('join-department', departmentId);
        socket.on('ticket-calling-spect', (data) => {
            const { ticket, windowNumber } = data;
            dispatch(updateInProgressTickets({ ticket, windowNumber }));
        });
        socket.on('ticket-in-progress-spectator', (data) => {
            const { ticket, windowNumber } = data;
            console.log(ticket);
            dispatch(updateInProgressTickets({ ticket, windowNumber }));
        });
        socket.on('complete-ticket-spectator', (data) => {
            const { session } = data;
            dispatch(
                deleteInProgressTicket({ windowNumber: session.windowNumber }),
            );
        });
        socket.on('ticket-calling-spectator', (data) => {
            const { ticket, session } = data;
            dispatch(
                updateInProgressTickets({
                    ticket,
                    windowNumber: session.windowNumber,
                }),
            );
        });
        socket.on('specialist-available-spectator', (data) => {
            const { session } = data;
            dispatch(
                deleteInProgressTicket({ windowNumber: session.windowNumber }),
            );
        });
        socket.on('logout-specialist-frontend', (data) => {
            const { windowNumber } = data;
            dispatch(deleteInProgressTicket({ windowNumber }));
        });

        return () => {
            socket.off('ticket-calling-spect');
            socket.off('ticket-in-progress-spectator');
        };
    }, []);

    console.log(tickets);

    if (success && tickets.length === 0) {
        return (
            <Box className={cls.emptyList}>
                <Typography align="center" fontWeight={600} variant="h5">
                    Нет обслуживающихся клиентов
                </Typography>
            </Box>
        );
    }

    if (failed) {
        return (
            <Box className={cls.emptyList}>
                <Typography align="center" fontWeight={600} variant="h5">
                    Ошибка. Что-то пошло не так! Попробуйте обновить страницу.
                </Typography>
                {errorMessage}
            </Box>
        );
    }

    if (success && tickets.length > 6) {
        return (
            <>
                <Box className={cls.list}>
                    {tickets.slice(0, 5).map((item) => (
                        <TicketItem
                            key={item._id}
                            status={item.status}
                            windowNumber={item.windowNumber}
                            ticketNumber={item.ticketNumber}
                        />
                    ))}
                </Box>
                <Box className={cls.divider} />
                <Box className={cls.list}>
                    {tickets.slice(6, 11).map((item) => (
                        <TicketItem
                            key={item._id}
                            status={item.status}
                            windowNumber={item.windowNumber}
                            ticketNumber={item.ticketNumber}
                        />
                    ))}
                </Box>
            </>
        );
    }

    return (
        <Box className={cls.list}>
            {tickets.map((item) => (
                <TicketItem
                    key={item._id}
                    status={item.status}
                    windowNumber={item.windowNumber}
                    ticketNumber={item.ticketNumber}
                />
            ))}
        </Box>
    );
};
