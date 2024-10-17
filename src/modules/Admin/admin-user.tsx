import {
    Alert,
    Box,
    Button,
    MenuItem,
    Snackbar,
    TextField,
} from '@mui/material';
import { rolesName } from '@shared/utils/roles';
import { instance } from '@shared/utils/axios-instance';
import { useEffect, useState } from 'react';

const AdminPage = () => {
    const [role, setRole] = useState<string | undefined>('');
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [departmentId, setDepartmentId] = useState<string>('');
    const [departmentsList, setDepartmentsList] = useState<
        { _id: string; name: string }[]
    >([]);
    const [departmentsLoading, setDepartmentsLoading] =
        useState<boolean>(false);

    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');

    const handleAddNewUser = async () => {
        try {
            const response = await instance.post('auth/register', {
                name,
                role,
                username,
                password,
                departmentId,
            });

            if (!response.data) {
                setSnackbarMessage('Пользователь не добавлен');
                setSnackbarSeverity('error');
            } else {
                setName('');
                setRole('');
                setUsername('');
                setPassword('');
                setDepartmentId('');
                setSnackbarMessage('Пользователь успешно добавлен');
                setSnackbarSeverity('success');
            }
        } catch (error) {
            setSnackbarMessage('Ошибка при добавлении пользователя');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const fetchDepartmentsList = async () => {
        setDepartmentsLoading(true);
        try {
            const response = await instance.get('departments');

            if (!response.data) {
                setName('');
                setSnackbarMessage(
                    'Не могу загрузить филиалы. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setDepartmentsLoading(false);
            } else {
                setDepartmentsList(response.data);
                setDepartmentsLoading(false);
            }
        } catch (error) {
            setName('');
            setSnackbarMessage('Ошибка при загрузке Филиалов');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setDepartmentsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartmentsList();
    }, []);

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
                        label="Логин"
                        id="fullWidth"
                        variant="filled"
                        value={username}
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            mb: '10px',
                        }}
                    />
                    <TextField
                        fullWidth
                        label="ФИО сотрудника"
                        id="fullWidth"
                        variant="filled"
                        value={name}
                        autoComplete="off"
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            mb: '10px',
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        id="fullWidth"
                        variant="filled"
                        value={password}
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            mb: '10px',
                        }}
                    />
                    <TextField
                        fullWidth
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        select
                        label="Выберите специальность"
                        variant="filled"
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            mb: '10px',
                        }}
                    >
                        {rolesName.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        select
                        label="Выберите филиал"
                        variant="filled"
                        disabled={departmentsLoading}
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
                        variant="contained"
                        onClick={handleAddNewUser}
                    >
                        Добавить нового пользователя
                    </Button>
                </Box>
            </Box>
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

export default AdminPage;
