import { Modal, Box, TextField, Button } from '@mui/material';
import { instance } from '@shared/utils/axios-instance';
import { ChangeEvent, useState } from 'react';

interface EditModalPasswordProps {
    itemId: string | undefined;
    handleCloseModal: (state: boolean) => void;
    open: boolean;
    setOpenSnackbar: (state: boolean) => void;
    setSnackbarMessage: (state: string) => void;
    setSnackbarSeverity: (state: 'success' | 'error') => void;
}

export const EditModalPassword = (props: EditModalPasswordProps) => {
    const {
        itemId,
        handleCloseModal,
        open,
        setOpenSnackbar,
        setSnackbarMessage,
        setSnackbarSeverity,
    } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>();

    const editUserPassword = async (password: string) => {
        setLoading(true);
        try {
            const response = await instance.put(`users/${itemId}/password`, {
                password,
            });

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу изменить пароль пользователя. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setLoading(false);
            } else {
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setLoading(false);
                handleCloseModal(false);
            }
        } catch (error) {
            setSnackbarMessage('Ошибка при изменении данных пользователя');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setLoading(false);
        }
    };

    const handleClose = () => handleCloseModal(false);

    const onChangeInput = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { value } = e.target;
        setPassword(value);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ display: 'flex' }}
            >
                <Box
                    sx={{
                        bgcolor: '#fff',
                        width: '500px',
                        padding: '20px',
                        borderRadius: '4px',
                        margin: 'auto',
                    }}
                >
                    <TextField
                        fullWidth
                        label="Новый пароль"
                        id="fullWidth"
                        variant="filled"
                        name="password"
                        value={password}
                        disabled={loading}
                        onChange={onChangeInput}
                        autoComplete="off"
                        margin="normal"
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                        }}
                    />

                    <Button
                        fullWidth
                        sx={{
                            mt: '30px',
                            height: '50px',
                            backgroundColor: '#0080ff',
                            '&:hover': {
                                backgroundColor: '#fff',
                                color: '#000',
                            },
                            '&:disabled': {
                                backgroundColor: '#061a33',
                                cursor: 'not-allowed',
                                color: '#939596',
                            },
                        }}
                        disabled={loading}
                        variant="contained"
                        onClick={() => {
                            if (password) {
                                editUserPassword(password);
                            }
                        }}
                    >
                        Изменить
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};
