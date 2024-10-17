import { Box, Typography } from '@mui/material';
import { AppDispatch, RootState } from '@shared/types/redux-types';
import { useDispatch, useSelector } from 'react-redux';
import { LastQueueItem } from './last-queues-item';
import { useEffect } from 'react';
import { getAllWaitingQueues } from '../../model/lastQueueSlice';
import useAuth from '@shared/hooks/useAuth';
import { LastQueuesSkeleton } from './last-queues-skeleton';

export const LastQueues = () => {
    const tickets = useSelector((state: RootState) => state.lastQueues.tickets);
    const status = useSelector((state: RootState) => state.lastQueues.status);
    const dispatch = useDispatch<AppDispatch>();
    const { departmentId } = useAuth();

    useEffect(() => {
        dispatch(getAllWaitingQueues(departmentId));
    }, []);

    if (status === 'pending') {
        return <LastQueuesSkeleton />;
    }

    if (status === 'failed') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    padding: '20px',
                    background: '#519FE8',
                    borderRadius: '10px',
                }}
            >
                <Typography fontWeight={600} align="center" color="#fff">
                    Что-то пошло не так. Попробуйте перезагрузить страницу.
                </Typography>
            </Box>
        );
    }

    if (!tickets || tickets.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    padding: '20px',
                    background: '#519FE8',
                    borderRadius: '10px',
                }}
            >
                <Typography
                    fontWeight={600}
                    align="center"
                    sx={{
                        background: '#fff',
                        padding: '40px',
                        borderRadius: '10px',
                        color: '#000',
                    }}
                >
                    Очередей нет
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                padding: '20px',
                background: '#519FE8',
                borderRadius: '10px',
            }}
        >
            {tickets.map((item, index) => (
                <LastQueueItem
                    ticketNumber={item.ticketNumber}
                    isLast={tickets.length - 1 === index}
                    key={item._id}
                />
            ))}
        </Box>
    );
};
