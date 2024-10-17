import { Box, Typography } from '@mui/material';
import cls from './ticket-item.module.scss';

interface TicketItemProps {
    status: 'calling' | 'in-progress';
    ticketNumber: string;
    windowNumber: number;
}

const TicketItem = (props: TicketItemProps) => {
    const { status, ticketNumber, windowNumber } = props;

    let classNameByStatus: string = cls.backgroundInProgress;
    let statusText: 'Вызывается' | 'Обслуживается' = 'Обслуживается';

    if (status === 'calling') {
        classNameByStatus = cls.backgroundCalling;
        statusText = 'Вызывается';
    }

    return (
        <Box className={cls.ticketWrapper}>
            <Box className={`${cls.ticketLeftWrapper} ${classNameByStatus}`}>
                <Typography variant="h5" className={cls.ticketTitle}>
                    {ticketNumber}
                </Typography>
                <Typography variant="body1" className={cls.ticketBody}>
                    {statusText}
                </Typography>
            </Box>
            <Box className={cls.ticketRightWrapper}>
                <Typography className={cls.ticketTitle} variant="h5">
                    {`№${windowNumber}`}
                </Typography>
                <Typography className={cls.ticketBody} variant="body1">
                    Окно
                </Typography>
            </Box>
        </Box>
    );
};

export default TicketItem;
