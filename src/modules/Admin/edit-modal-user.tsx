import { Modal, Box, TextField, Button, MenuItem } from '@mui/material';
import { instance } from '@shared/utils/axios-instance';
import { ChangeEvent, useEffect, useState } from 'react';

interface EditModalUserProps {
    itemId: string | undefined;
    handleCloseModal: (state: boolean) => void;
    open: boolean;
    departmentsList: { _id: string; name: string }[];
    setOpenSnackbar: (state: boolean) => void;
    setSnackbarMessage: (state: string) => void;
    setSnackbarSeverity: (state: 'success' | 'error') => void;
    handleEditUserData: (item: User) => void;
}

export interface User {
    _id: string;
    name: string;
    username: string;
    password: string;
    role: 'operator' | 'specialist' | 'television';
    departmentId: string;
    active: boolean;
}

const rolesList = [
    { value: 'operator', name: 'Оператор' },
    { value: 'specialist', name: 'Специалист' },
    { value: 'spectator', name: 'Телевизор' },
];

export const EditModalUser = (props: EditModalUserProps) => {
    const {
        itemId,
        handleCloseModal,
        open,
        departmentsList,
        setOpenSnackbar,
        setSnackbarMessage,
        setSnackbarSeverity,
        handleEditUserData,
    } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<User>();

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await instance.get(`users/user/${itemId}`);

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить данные о пользователе. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setLoading(false);
            } else {
                setUserData(response.data.userData);
                setLoading(false);
            }
        } catch (error) {
            if (itemId) {
                setSnackbarMessage('Ошибка при загрузке Филиалов');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setLoading(false);
            }
        }
    };

    const editUser = async (user: User) => {
        setLoading(true);
        try {
            const response = await instance.put(`users/${itemId}`, {
                username: user.username,
                name: user.name,
                role: user.role,
                departmentId: user.departmentId,
            });

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу изменить данные пользователя. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setLoading(false);
            } else {
                handleEditUserData(response.data.newUserData);
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

    useEffect(() => {
        if (itemId) {
            fetchUserData();
        }
    }, [itemId]);

    const handleClose = () => handleCloseModal(false);

    const onChangeInput = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { value, name } = e.target;
        setUserData((prev) => {
            if (!prev) return undefined;
            return { ...prev, [name]: value };
        });
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
                        label="ФИО сотрудника"
                        id="fullWidth"
                        variant="filled"
                        name="name"
                        value={userData?.name || ''}
                        disabled={loading}
                        onChange={onChangeInput}
                        autoComplete="off"
                        margin="normal"
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Username"
                        id="fullWidth"
                        variant="filled"
                        name="username"
                        value={userData?.username || ''}
                        disabled={loading}
                        onChange={onChangeInput}
                        autoComplete="off"
                        margin="normal"
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                        }}
                    />
                    <TextField
                        fullWidth
                        value={userData?.role || ''}
                        onChange={onChangeInput}
                        name="role"
                        select
                        label="Выберите роль"
                        variant="filled"
                        disabled={loading}
                        margin="normal"
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            mb: '10px',
                        }}
                    >
                        {rolesList.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        value={userData?.departmentId || ''}
                        onChange={onChangeInput}
                        name="departmentId"
                        select
                        label="Выберите филиал"
                        variant="filled"
                        disabled={loading}
                        margin="normal"
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            mb: '10px',
                        }}
                    >
                        {departmentsList.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
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
                        disabled={loading || !userData}
                        variant="contained"
                        onClick={() => {
                            if (userData) {
                                editUser(userData);
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
