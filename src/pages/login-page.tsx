import { Alert, MenuItem, Snackbar } from '@mui/material';
import { Box } from '@shared/ui/Box';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import cls from './login-page.module.scss';
import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
    {
        content: 'TS',
        id: 'TS',
    },
    {
        content: 'VS',
        id: 'VS',
    },
];

const LoginPage = () => {
    const [windowNumber, setWindowNumber] = useState<string | undefined>('');
    const [roleName, setRoleName] = useState<string | undefined>(roles[0].id);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success');

    const { userId, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            navigate(role);
        }
    }, []);

    const handleLogin = async () => {
        setResponseLoading(true);
        try {
            const response = await instance.post('auth', {
                username,
                password,
                ticketsType: roleName,
                windowNumber,
            });

            if (!response.data) {
                setSnackbarMessage('Ошибка при входе в систему');
                setOpenSnackbar(true);
                setSnackbarSeverity('error');
                setResponseLoading(false);
            } else {
                setRoleName('');
                setUsername('');
                setPassword('');
                setSnackbarMessage('Пользователь успешно вошел');
                setSnackbarSeverity('success');
                localStorage.setItem('token', response.data.accessToken);
                setResponseLoading(false);
                navigate(response.data.path);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error);
                setSnackbarMessage(error.response?.data.message);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setResponseLoading(false);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Box
                classNames={cls.wrapper}
                direction="column"
                justify="center"
                align="center"
            >
                <Box
                    shadow
                    classNames={cls.login}
                    direction="column"
                    justify="center"
                    align="center"
                >
                    <TextField
                        label="Логин"
                        type="text"
                        fullWidth
                        disabled={responseLoading}
                        value={username}
                        margin="dense"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        fullWidth
                        margin="dense"
                        disabled={responseLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        select
                        margin="dense"
                        onChange={(e) => setRoleName(e.target.value)}
                        value={roleName}
                        fullWidth
                    >
                        {roles.map((item) => (
                            <MenuItem key={item.content} value={item.content}>
                                {item.content}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Номер окна"
                        type="number"
                        fullWidth
                        margin="dense"
                        disabled={responseLoading}
                        value={windowNumber}
                        onChange={(e) => setWindowNumber(e.target.value)}
                    />
                    <Button
                        fullWidth
                        disabled={responseLoading}
                        onClick={handleLogin}
                        variant="contained"
                        sx={{ margin: '10px 0' }}
                    >
                        Войти
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

export default LoginPage;
