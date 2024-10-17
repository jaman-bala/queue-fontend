import { Button } from '@mui/material';

interface TakeBreakeProps {
    loading?: boolean;
}

const TakeBreake = (props: TakeBreakeProps) => {
    const { loading } = props;
    const text = 'Взять перерыв';
    return (
        <Button
            sx={{
                backgroundColor: '#5269eb',
                variant: 'contained',
                color: '#FFF',
                mr: '10px',
            }}
            disabled={loading}
        >
            {text}
        </Button>
    );
};

export default TakeBreake;
