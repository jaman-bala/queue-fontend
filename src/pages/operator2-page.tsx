import { RegistrationQueues } from '@modules/Queue/ui/registration-queues/registration-queues';
import { Box } from '@mui/material';
import cls from './operator.module.scss';

const OperatorPage2 = () => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                height: '100dvh',
            }}
        >
            <Box
                sx={{
                    boxShadow: '1px 1px 10px 1px #000',
                    margin: '30px 30px',
                }}
                className={cls.cardWrapper}
            >
                <RegistrationQueues />
            </Box>
        </Box>
    );
};

export default OperatorPage2;
