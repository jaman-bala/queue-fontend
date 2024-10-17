import useAuth from '@shared/hooks/useAuth';
import { instance } from '@shared/utils/axios-instance';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '@shared/utils/socket';
import { Box, Button } from '@mui/material';
import { MenuItem } from './menu-item';
import { Icon } from '@shared/ui/Icon';
import LogOutIcon from '@shared/assets/icons/logout.svg';
import cls from './menu.module.scss';
import { getFormattedName } from '@shared/utils/string-helpers';
import { playNotificationSound } from '@shared/utils/speech';

export default function Menu() {
    const {
        userId,
        sessionId,
        role,
        departmentId,
        username,
        departmentName,
        windowNumber,
        name,
    } = useAuth();
    const navigate = useNavigate();

    if (!userId) {
        return null;
    }

    const isSpectator = role === 'spectator';
    const classForSpectator = isSpectator ? cls.menuWrapper : undefined;
    const formattedName = getFormattedName(name, role);

    const handleLogout = async () => {
        try {
            const response: AxiosResponse = await instance.post(
                '/auth/logout',
                {
                    sessionId,
                    userId,
                },
            );
            if (!response.data) {
                return console.log('something went wrong when logout');
            }
            if (role === 'specialist') {
                socket.emit('logout-specialist-backend', {
                    userId,
                    sessionId,
                    departmentId,
                });
            }
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Box
                sx={{
                    background: '#519FE8',
                    width: '300px',
                    height: '100dvh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    padding: '10px',
                }}
                className={classForSpectator}
            >
                <Box>
                    <Box
                        sx={{
                            background: '#FFFFFF',
                            height: '165px',
                            width: '165px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '48px',
                            borderRadius: '50%',
                            marginTop: '50px',
                            marginBottom: '50px',
                            color: '#4B4F51',
                        }}
                    >
                        {formattedName}
                    </Box>
                    <Box width={'165px'}>
                        <MenuItem title="ФИО:" value={name} />
                        <MenuItem title="Имя пользователя:" value={username} />
                        <MenuItem title="Филиал:" value={departmentName} />
                        {role === 'specialist' && (
                            <MenuItem
                                title="Окно:"
                                value={windowNumber.toString()}
                            />
                        )}
                    </Box>
                    {role === 'spectator' && (
                        <Button onClick={() => playNotificationSound()}>
                            Звук
                        </Button>
                    )}
                </Box>
                {userId ? (
                    <Button
                        onClick={handleLogout}
                        sx={{
                            textTransform: 'none',
                            color: '#fff',
                            padding: '10px 30px',
                        }}
                    >
                        <Icon
                            Svg={LogOutIcon}
                            sx={{
                                width: '38px',
                                height: '38px',
                                fill: '#fff',
                                marginRight: '20px',
                            }}
                        ></Icon>{' '}
                        Выйти из системы
                    </Button>
                ) : null}
            </Box>
            {isSpectator && <Box className={cls.drawer} />}
        </>
    );
}
