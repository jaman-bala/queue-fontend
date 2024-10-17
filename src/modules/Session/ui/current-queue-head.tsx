import { Box } from '@mui/material';
import cls from './current-queue-head.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@shared/types/redux-types';
import {
    getCurrentTicket,
    startService,
    completeService,
    endLoading,
    resetTimer,
    updateTicket,
    updateSession,
} from '../model/currentQueue';
import useAuth from '@shared/hooks/useAuth';
import { useEffect } from 'react';
import { formattedTime } from '@shared/utils/date-helpers';
import { TimerComponent } from './timer-component';
import clsx from 'clsx';
import { socket } from '@shared/utils/socket';

export const CurrentQueueHeader = () => {
    const hasTicket = useSelector(
        (state: RootState) => state.currentQueue.noAvailableTicket,
    );
    const { sessionId, departmentId } = useAuth();
    const ticket = useSelector((state: RootState) => state.currentQueue.ticket);
    const session = useSelector(
        (state: RootState) => state.currentQueue.session,
    );
    const status = useSelector((state: RootState) => state.currentQueue.status);
    const sessionStatus = useSelector(
        (state: RootState) => state.currentQueue.sessionStatus,
    );
    const dispatch: AppDispatch = useDispatch();

    console.log('session:', session);
    console.log('ticket:', ticket);

    useEffect(() => {
        dispatch(getCurrentTicket({ sessionId, departmentId }));
    }, [dispatch, sessionId, departmentId]);

    useEffect(() => {
        socket.emit('join-department', departmentId);
        socket.emit('join-session', sessionId);
        socket.on('ticket-in-progress-spec', (data) => {
            dispatch(endLoading());
            dispatch(startService());
        });
        socket.on('complete-ticket-spec', (data) => {
            dispatch(endLoading());
            dispatch(completeService());
        });
        socket.on('ticket-calling-spec', (data) => {
            const { ticket, session } = data;
            dispatch(endLoading());
            dispatch(resetTimer());
            dispatch(updateTicket({ ticket, session }));
        });

        socket.on('specialist-available-spec', (data) => {
            const { session } = data;
            dispatch(endLoading());
            dispatch(resetTimer());
            dispatch(updateSession({ session }));
        });

        return () => {
            socket.off('ticket-in-progress-spec');
            socket.off('specialist-available-spec');
            socket.off('complete-ticket-spec');
            socket.off('ticket-calling-spec');
        };
    }, []);

    let timerNode = <TimerComponent />;

    if (status === 'pending') {
        return (
            <Box className={cls.wrapper}>
                <p className={clsx(cls.title, cls.pending)}></p>
                <Box className={cls.cardWrapper}>
                    <Box className={cls.card}>
                        <p className={cls.description}>Получил талон в:</p>
                        <p className={cls.time}>--:--</p>
                    </Box>
                    <Box className={cls.card}>
                        <p className={cls.description}>Время:</p>
                        <p className={cls.time}>--:--</p>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (sessionStatus === 'available') {
        return (
            <Box className={cls.wrapper}>
                <p className={cls.title}>Пока нет клиента</p>
                <Box className={cls.cardWrapper}>
                    <Box className={cls.card}>
                        <p className={cls.description}>Получил талон в:</p>
                        <p className={cls.time}>--:--</p>
                    </Box>
                    <Box className={cls.card}>
                        <p className={cls.description}>Время:</p>
                        <p className={cls.time}>--:--</p>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box className={cls.wrapper}>
            <p className={cls.title}>{ticket?.ticketNumber}</p>
            <Box className={cls.cardWrapper}>
                <Box className={cls.card}>
                    <p className={cls.description}>Получил талон в:</p>
                    <p className={cls.time}>
                        {formattedTime(ticket?.createdAt ?? '')}
                    </p>
                </Box>
                <Box className={cls.card}>
                    <p className={cls.description}>Время:</p>
                    <p className={cls.time}>{timerNode}</p>
                </Box>
            </Box>
        </Box>
    );
};
