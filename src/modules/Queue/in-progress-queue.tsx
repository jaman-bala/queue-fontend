import { Box, Typography } from '@mui/material';

interface InProgressQueueProps {
    items:
        | {
              windowNumber: string;
              ticketNumber: string;
          }[]
        | undefined;
}

const InProgressQueue = (props: InProgressQueueProps) => {
    const { items } = props;

    const length = items ? items.length > 0 : false;

    const content = length ? (
        items &&
        items.slice(0, 5).map((item) => (
            <Box
                key={item.ticketNumber}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{
                        backgroundColor: '#1976d2',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        padding: '30px',
                        color: '#fff',
                        marginRight: '20px',
                        textAlign: 'center',
                    }}
                >
                    {`${item.ticketNumber}` + ''}
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{
                        backgroundColor: '#1976d2',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        width: '100px',
                        padding: '30px',
                        color: '#fff',
                        textAlign: 'center',
                    }}
                >
                    {`${item.windowNumber}`}
                </Typography>
            </Box>
        ))
    ) : (
        <Typography
            variant="h5"
            align="center"
            sx={{ color: '#3e78e8', mt: '30px' }}
        >
            Нет никого на окошке
        </Typography>
    );

    return (
        <Box
            sx={{
                width: '400px',
                padding: '15px',
                borderRadius: '10px',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                }}
            >
                <Typography variant="h5">Номер талона</Typography>
                <Typography variant="h5">Окно</Typography>
            </Box>

            {content}
        </Box>
    );
};

export default InProgressQueue;
