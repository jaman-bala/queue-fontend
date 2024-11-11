import { Box, MenuItem, TextField, Typography } from '@mui/material';
import TicketItem from './ticket-item';
import cls from './ticket-list.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@shared/types/redux-types';
import { getAllDepartments, getInProgressQueues } from '../model/ticket-admin';
export const SessionDepartment = () => {
    const departments = useSelector(
        (state: RootState) => state.ticketAdmin.departments,
    );
    const [departmentId, setDepartmentId] = useState<string>(
        departments[0]._id,
    );
    const dispatch = useDispatch<AppDispatch>();
    const tickets = useSelector(
        (state: RootState) => state.ticketAdmin.tickets,
    );
    const status = useSelector((state: RootState) => state.ticketAdmin.status);
    const error = useSelector((state: RootState) => state.ticketAdmin.error);

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
    }, [departmentId]);

    useEffect(() => {
        dispatch(getAllDepartments());
    }, []);

    console.log(departmentId);

    let content;

    if (success) {
        content = (
            <>
                <Box className={cls.list}>
                    {tickets.map((item) => (
                        <TicketItem
                            key={item.ticketNumber}
                            status={item.status}
                            windowNumber={item.windowNumber}
                            ticketNumber={item.ticketNumber}
                            isAdmin
                        />
                    ))}
                </Box>
            </>
        );
    }

    if (success && tickets.length === 0) {
        content = (
            <Box className={cls.emptyList}>
                <Typography align="center" fontWeight={600} variant="h5">
                    Нет обслуживающихся клиентов
                </Typography>
            </Box>
        );
    }

    if (failed) {
        content = (
            <Box className={cls.emptyList}>
                <Typography align="center" fontWeight={600} variant="h5">
                    Ошибка. Что-то пошло не так! Попробуйте обновить страницу.
                </Typography>
                {errorMessage}
            </Box>
        );
    }

    console.log(tickets);

    return (
        <>
            <TextField
                fullWidth
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                select
                label="Выберите филиал"
                variant="filled"
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    mb: '10px',
                }}
            >
                {departments.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>
            {content}
        </>
    );
};
