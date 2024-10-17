import { Box } from '@mui/material';
import cls from './specialist-page.module.scss';
import { CurrentQueueHeader } from '@modules/Session/ui/current-queue-head';
import { ActionsQueueBody } from '@modules/Session/ui/actions-queue-body';

export const SpecialistPage = () => {
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
                <CurrentQueueHeader />
                <ActionsQueueBody />
            </Box>
        </Box>
    );
};
