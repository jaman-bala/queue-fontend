import {
    Alert,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Skeleton,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { EditModalDepartments } from './edit-modal';
import { instance } from '@shared/utils/axios-instance';
import { useEffect, useState } from 'react';

const skeletonWidths = [212, 61, 301, 401, 90, 25, 70];

const AdminDepartment = () => {
    const [name, setName] = useState<string>('');
    const [items, setItems] = useState<{ _id: string; name: string }[]>([]);
    const [itemsLoading, setItemsLoading] = useState<boolean>(false);
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedDepartment, setSelectedDepartment] = useState<string>();

    const fetchDepartmentsList = async () => {
        setItemsLoading(true);
        try {
            const response = await instance.get('departments');

            if (!response.data) {
                setName('');
                setSnackbarMessage(
                    'Не могу загрузить филиалы. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setItemsLoading(false);
            } else {
                setItems(response.data);
                setItemsLoading(false);
            }
        } catch (error) {
            setName('');
            setSnackbarMessage('Ошибка при загрузке Филиалов');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setItemsLoading(false);
        }
    };

    const handleAddNewDepartment = async () => {
        try {
            setResponseLoading(true);
            const response = await instance.post('departments/add', { name });

            if (!response.data) {
                setName('');
                setSnackbarMessage('Филиал не добавлена');
                setSnackbarSeverity('error');
                setResponseLoading(false);
            } else {
                setName('');
                setSnackbarMessage('Филиал успешно добавлен');
                setSnackbarSeverity('success');
                fetchDepartmentsList();
                setResponseLoading(false);
            }
        } catch (error) {
            setName('');
            setSnackbarMessage('Ошибка при добавлении Филиала');
            setSnackbarSeverity('error');
            setResponseLoading(false);
        } finally {
            setOpenSnackbar(true);
        }
    };

    const editDepartments = (department: { _id: string; name: string }) => {
        setItems((prev = []) => {
            const updatedDepartment = prev.find(
                (item) => department._id === item._id,
            );
            if (updatedDepartment) {
                return prev.map((item) =>
                    item._id === department._id ? department : item,
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
        setSelectedDepartment(id);
    };

    const deleteDepartment = async (departmentId: string) => {
        setItemsLoading(true);
        try {
            const response = await instance.delete(
                `departments/${departmentId}`,
            );

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу смог уж. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setItemsLoading(false);
            } else {
                setItems((prev) =>
                    prev.filter((department) => {
                        return (
                            department._id !==
                            response.data.deletedDepartment._id
                        );
                    }),
                );
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setItemsLoading(false);
            }
        } catch (error) {
            setName('');
            setSnackbarMessage('Ошибка при удалении филиала');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setItemsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartmentsList();
    }, []);

    const isEmptyItems =
        items.length > 0 ? (
            <List sx={{ width: '100%' }}>
                {items.map((item, index) => (
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
                            onClick={() => deleteDepartment(item._id)}
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
                Нет добавленных филиалов
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
                        width: '600px',
                    }}
                >
                    <TextField
                        fullWidth
                        label="Департамент"
                        id="fullWidth"
                        variant="filled"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off"
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
                        disabled={responseLoading}
                        variant="contained"
                        onClick={handleAddNewDepartment}
                    >
                        Добавить департамент
                    </Button>
                </Box>
                {skeleton}
            </Box>
            <EditModalDepartments
                itemId={selectedDepartment}
                handleCloseModal={setOpenModal}
                handleEditDepartments={editDepartments}
                open={openModal}
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

export default AdminDepartment;
