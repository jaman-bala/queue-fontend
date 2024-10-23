import { Box, Button } from '@mui/material';
import cls from './actions-queue-body.module.scss';
import clsx from 'clsx';
import { AppDispatch, RootState } from '@shared/types/redux-types';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '@shared/utils/socket';
import useAuth from '@shared/hooks/useAuth';
import { startLoading } from '../model/currentQueue';

export const ActionsQueueBody = () => {
    const { sessionId, departmentId, ticketsType } = useAuth();
    const hasTicket = useSelector(
        (state: RootState) => state.currentQueue.noAvailableTicket,
    );
    const ticket = useSelector((state: RootState) => state.currentQueue.ticket);
    const status = useSelector((state: RootState) => state.currentQueue.status);
    const sessionStatus = useSelector(
        (state: RootState) => state.currentQueue.sessionStatus,
    );
    const dispatch: AppDispatch = useDispatch();

    let content = <Box className={cls.wrapper}></Box>;

    const handleStartService = () => {
        dispatch(startLoading());
        socket.emit('start-service', {
            sessionId,
            departmentId,
        });
    };

    const handleSkipTicket = () => {
        dispatch(startLoading());
        socket.emit('ticket-skip', {
            sessionId,
            departmentId,
            ticketsType,
        });
    };

    const handleCompleteService = () => {
        dispatch(startLoading());
        socket.emit('complete-ticket', {
            sessionId,
            departmentId,
        });
    };
    const handleNextTicket = () => {
        dispatch(startLoading());
        socket.emit('ticket-next', {
            sessionId,
            departmentId,
            ticketsType,
        });
    };

    const handleCallAgain = () => {
        socket.emit('call-again', {
            departmentId,
            sessionId,
        });
    };

    console.log(ticket);
    console.log('hasTicket:', hasTicket);
    console.log('sessionStatus:', sessionStatus);

    if (sessionStatus === 'available') {
        content = (
            <Box className={cls.wrapper}>
                <Button disabled className={clsx(cls.button, cls.recall)}>
                    Позвать заново
                </Button>
                <Button disabled className={clsx(cls.button, cls.start)}>
                    Начать консультацию
                </Button>
                <Button disabled className={clsx(cls.button, cls.skip)}>
                    Клиент не подошёл
                </Button>
            </Box>
        );
    }

    if (sessionStatus === 'calling') {
        content = (
            <Box className={cls.wrapper}>
                <Button
                    onClick={handleCallAgain}
                    className={clsx(cls.button, cls.recall)}
                >
                    Позвать заново
                </Button>
                <Button
                    onClick={handleStartService}
                    className={clsx(cls.button, cls.start)}
                >
                    Начать консультацию
                </Button>
                <Button
                    onClick={handleSkipTicket}
                    className={clsx(cls.button, cls.skip)}
                >
                    Клиент не подошёл
                </Button>
            </Box>
        );
    }

    if (sessionStatus === 'in-progress') {
        content = (
            <Box className={cls.wrapper}>
                <div></div>
                <Button
                    onClick={handleCompleteService}
                    className={clsx(cls.button, cls.complete)}
                >
                    Завершить консультацию
                </Button>
                <div></div>
            </Box>
        );
    }
    if (sessionStatus === 'serviced') {
        content = (
            <Box className={cls.wrapper}>
                <div></div>
                <Button
                    onClick={handleNextTicket}
                    className={clsx(cls.button, cls.next)}
                >
                    Следуйщий клиент
                </Button>
                <div></div>
            </Box>
        );
    }

    if (status === 'pending') {
        return (
            <Box className={cls.wrapper}>
                <Button
                    disabled
                    className={clsx(cls.button, cls.recall, cls.pending)}
                ></Button>
                <Button
                    disabled
                    className={clsx(cls.button, cls.start, cls.pending)}
                ></Button>
                <Button
                    disabled
                    className={clsx(cls.button, cls.skip, cls.pending)}
                ></Button>
            </Box>
        );
    }

    if (status === 'succeeded') {
        return content;
    }
};
