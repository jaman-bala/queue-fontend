import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import classes from './queue-cards.module.scss';
import { QueuesTypesRu } from '@shared/types/queues-types';

interface QueueCardsProps {
    backgroundColor?: string;
    items: string[];
    ticketType: QueuesTypesRu;
}

const QueueCards = (props: QueueCardsProps) => {
    const { backgroundColor = '#fff', items } = props;

    const content =
        items.length > 0 ? (
            <>
                <List>
                    {items.slice(0, 5).map((item) => (
                        <ListItem
                            key={item}
                            sx={{
                                backgroundColor: '#1976d2',
                                borderRadius: '10px',
                                color: '#fff',
                                width: '230px',
                                m: '0 auto 10px',
                            }}
                        >
                            <ListItemText
                                sx={{
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: '24px',
                                }}
                                primary={item}
                            />
                        </ListItem>
                    ))}
                </List>
                <List>
                    <Typography
                        sx={{
                            color: '#3e78e8',
                            textAlign: 'center',
                            fontWeight: '600',
                        }}
                    >
                        Последний:
                    </Typography>
                    <ListItem
                        key={items[items.length - 1]}
                        sx={{
                            backgroundColor: '#1976d2',
                            borderRadius: '10px',
                            marginBottom: '10px',
                            color: '#fff',
                            width: '230px',
                            m: '0 auto 10px',
                        }}
                    >
                        <ListItemText
                            sx={{
                                textAlign: 'center',
                                fontWeight: '600',
                                fontSize: '24px',
                            }}
                            id={classes.cards}
                            className={classes.cards}
                            primary={items[items.length - 1]}
                        />
                    </ListItem>
                </List>
            </>
        ) : (
            <Typography
                variant="body1"
                align="center"
                sx={{
                    color: '#3e78e8',
                    mt: '30px',
                    fontSize: '16px',
                    width: '230px',
                }}
            >
                Нет никого в очереди
            </Typography>
        );

    return (
        <Box
            sx={{
                padding: '20px',
                backgroundColor,
                boxShadow: '2px 2px 10px 2px',
                borderRadius: '10px',
                mt: '20px',
            }}
        >
            {content}
        </Box>
    );
};

export default QueueCards;
