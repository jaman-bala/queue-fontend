import {
    addTicket,
    removeTicket,
    setLoading,
    setPrintData,
} from '@modules/Queue/model/lastQueueSlice';
import { PrintData } from '@modules/Queue/model/types';
import { Box } from '@mui/material';
import useAuth from '@shared/hooks/useAuth';
import { QueuesTypes } from '@shared/types/queues-types';
import { AppDispatch } from '@shared/types/redux-types';
import { Button } from '@shared/ui/Button';
import { buttonQueueList } from '@shared/utils/configs';
import { formattedDate } from '@shared/utils/date-helpers';
import { socket } from '@shared/utils/socket';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const RegistrationQueues = () => {
    const { departmentId } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('join-department', departmentId);
        socket.on('ticket-added', (data) => {
            const { ticket } = data;
            dispatch(addTicket(ticket));
            const printData: PrintData = {
                createdAt: formattedDate(ticket.createdAt),
                ticket: ticket.ticketNumber,
                departmentName: data.departmentName,
            };
            dispatch(setPrintData(printData));
            dispatch(setLoading('succeeded'));
            navigate('/print');
        });
        socket.on('ticket-in-progress', (data) => {
            const { ticket, departmentName, hasQueues } = data;
            dispatch(removeTicket(ticket));
            if (hasQueues) {
                dispatch(
                    setPrintData({
                        ticket: ticket.ticketNumber,
                        departmentName: departmentName,
                        createdAt: formattedDate(ticket.createdAt),
                    }),
                );
                navigate('/print');
            }
            dispatch(setLoading('succeeded'));
        });

        return () => {
            socket.off('ticket-added');
            socket.off('ticket-in-progress');
        };
    }, []);

    const addNewTicket = (ticketType: QueuesTypes) => {
        dispatch(setLoading('pending'));
        socket.emit('add-new-ticket', {
            departmentId,
            ticketType,
        });
    };

    return (
        <Box
            sx={{
                background: '#519FE8',
                borderRadius: '10px',
                width: '880px',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            {buttonQueueList.map((item, index) => {
                return (
                    <Button
                        sx={{
                            marginBottom:
                                buttonQueueList.length === index ? '0' : '10px',
                            fontSize: '20px',
                            padding: '18px 0',
                        }}
                        onClick={() => addNewTicket(item.type)}
                        key={item.type}
                    >
                        {item.text}
                    </Button>
                );
            })}
        </Box>
    );
};
