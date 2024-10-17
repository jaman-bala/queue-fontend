import {
    Alert,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Skeleton,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { EditModalUser } from './edit-modal-user';
import { instance } from '@shared/utils/axios-instance';
import { useEffect, useState } from 'react';
import { User } from './edit-modal-user';
import { EditModalPassword } from './edit-modal-password';

const skeletonWidths = [212, 61, 301, 401, 90, 25, 70];

export const AdminUsersList = () => {
    const [items, setItems] = useState<{ _id: string; name: string }[]>([]);
    const [usersList, setUsersList] = useState<User[]>([]);
    const [departmentId, setDepartmentId] = useState<string>('');
    const [itemsLoading, setItemsLoading] = useState<boolean>(false);
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalPassword, setOpenModalPassword] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<string>();

    const fetchDepartmentsList = async () => {
        setItemsLoading(true);
        try {
            const response = await instance.get('departments');

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить филиалы. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setItemsLoading(false);
            } else {
                setDepartmentId(response.data[0]._id);
                setItems(response.data);
                setItemsLoading(false);
            }
        } catch (error) {
            setSnackbarMessage('Ошибка при загрузке Филиалов');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setItemsLoading(false);
        }
    };
    const fetchUsersList = async () => {
        setItemsLoading(true);
        try {
            const response = await instance.get(`users/${departmentId}`);

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить пользователей. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setItemsLoading(false);
            } else {
                setUsersList(response.data);
                setItemsLoading(false);
            }
        } catch (error) {
            setSnackbarMessage('Ошибка при загрузке Филиалов');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setItemsLoading(false);
        }
    };

    const editUserData = (user: User) => {
        setUsersList((prev = []) => {
            const updatedUser = prev.find((item) => user._id === item._id);
            if (updatedUser) {
                return prev.map((item) =>
                    item._id === user._id ? user : item,
                );
            } else {
                return prev;
            }
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenModal = (id: string) => {
        setOpenModal(true);
        setSelectedUser(id);
    };
    const handleOpenModalPassword = (id: string) => {
        setOpenModalPassword(true);
        setSelectedUser(id);
    };

    const deleteUser = async (userId: string) => {
        setResponseLoading(true);
        try {
            const response = await instance.delete(`users/${userId}`);

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу удалить пользователя. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setResponseLoading(false);
            } else {
                setUsersList((prev) =>
                    prev.filter((user) => {
                        return user._id !== response.data.userId;
                    }),
                );
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setResponseLoading(false);
            }
        } catch (error) {
            setSnackbarMessage('Ошибка при удалении филиала');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setResponseLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartmentsList();
    }, []);

    useEffect(() => {
        if (departmentId) {
            fetchUsersList();
        }
    }, [departmentId]);

    const isEmptyItems =
        usersList.length > 0 ? (
            <List sx={{ width: '100%' }}>
                {usersList.map((item, index) => (
                    <ListItem
                        key={item._id}
                        sx={{
                            borderBottom: '1px solid #3e78e8',
                        }}
                    >
                        <ListItemText
                            sx={{ color: '#000' }}
                            primary={`${index + 1}. ${item.name}`}
                        />
                        <Button
                            sx={{
                                height: '50px',
                                backgroundColor: '#0080ff',
                                '&:hover': {
                                    backgroundColor: '#061a33',
                                },
                                '&:disabled': {
                                    backgroundColor: '#061a33',
                                    cursor: 'not-allowed',
                                    color: '#939596',
                                },
                            }}
                            disabled={responseLoading}
                            variant="contained"
                            onClick={() => handleOpenModalPassword(item._id)}
                        >
                            Изменить пароль
                        </Button>
                        <Button
                            sx={{
                                marginLeft: '10px',
                                height: '50px',
                                backgroundColor: '#0080ff',
                                '&:hover': {
                                    backgroundColor: '#061a33',
                                },
                                '&:disabled': {
                                    backgroundColor: '#061a33',
                                    cursor: 'not-allowed',
                                    color: '#939596',
                                },
                            }}
                            disabled={responseLoading}
                            variant="contained"
                            onClick={() => handleOpenModal(item._id)}
                        >
                            Изменить
                        </Button>
                        <Button
                            sx={{
                                marginLeft: '10px',
                                height: '50px',
                                backgroundColor: '#ff1814',
                                '&:hover': {
                                    backgroundColor: '#990603',
                                },
                                '&:disabled': {
                                    backgroundColor: '#061a33',
                                    cursor: 'not-allowed',
                                    color: '#939596',
                                },
                            }}
                            disabled={responseLoading}
                            variant="contained"
                            onClick={() => deleteUser(item._id)}
                        >
                            Удалить
                        </Button>
                    </ListItem>
                ))}
            </List>
        ) : (
            <Typography
                align="center"
                variant="h5"
                component="h5"
                sx={{ width: '100%', mt: '30px' }}
            >
                Нет добавленных пользователей
            </Typography>
        );

    const skeleton = itemsLoading ? (
        <List sx={{ width: '100%' }}>
            {skeletonWidths.map((item) => (
                <ListItem
                    key={item}
                    sx={{
                        borderBottom: '1px solid #3e78e8',
                        marginBottom: '10px',
                    }}
                >
                    <Skeleton variant="rounded" width={item} height={15} />
                </ListItem>
            ))}
        </List>
    ) : (
        isEmptyItems
    );

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    margin: '20px 200px',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: '#3e78e8',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '800px',
                    }}
                >
                    <TextField
                        fullWidth
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        select
                        label="Выберите филиал"
                        variant="filled"
                        disabled={itemsLoading}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            mb: '10px',
                        }}
                    >
                        {items.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                {skeleton}
            </Box>
            <EditModalUser
                itemId={selectedUser}
                departmentsList={items}
                handleCloseModal={setOpenModal}
                handleEditUserData={editUserData}
                open={openModal}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />
            <EditModalPassword
                itemId={selectedUser}
                handleCloseModal={setOpenModalPassword}
                open={openModalPassword}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
            />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};
