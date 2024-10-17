import { Box, Typography } from '@mui/material';
import cls from './menu-item.module.scss';

interface MenuItem {
    title: string;
    value: string;
}

export const MenuItem = (props: MenuItem) => {
    const { title, value } = props;
    return (
        <Box sx={{ marginBottom: '10px' }}>
            <Typography color="#4B4F51">{title}</Typography>
            <Typography fontSize={20} color="#fff" className={cls.textItem}>
                {value}
            </Typography>
        </Box>
    );
};
