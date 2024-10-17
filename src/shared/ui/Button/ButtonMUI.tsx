import { Button, ButtonProps } from '@mui/material';
import { memo } from 'react';

export const ButtonMUI = memo((props: ButtonProps) => {
    const { children, sx = {}, ...otherProps } = props;

    return (
        <Button
            variant="contained"
            sx={{
                background: '#fff',
                color: '#000',
                width: '700px',
                textTransform: 'none',
                fontWeight: '600',
                '&:hover': {
                    backgroundColor: '#d9d9d9',
                    color: '#000',
                },
                '&:disabled': {
                    backgroundColor: '#061a33',
                    cursor: 'not-allowed',
                    color: '#939596',
                },
                ...sx,
            }}
            {...otherProps}
        >
            {children}
        </Button>
    );
});
