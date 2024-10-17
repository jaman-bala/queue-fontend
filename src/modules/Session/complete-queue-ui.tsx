import { Button } from '@mui/material';

interface CompleteQueueProps {
    loading?: boolean;
    onClickNext: () => void;
    ticket?: string | null;
}

const CompleteQueue = (props: CompleteQueueProps) => {
    const { loading, onClickNext, ticket } = props;
    return (
        <Button
            sx={{
                backgroundColor: '#abcd23',
                variant: 'contained',
                color: '#FFF',
            }}
            onClick={onClickNext}
            disabled={loading || !ticket}
        >
            Следующий клиент
        </Button>
    );
};

export default CompleteQueue;
