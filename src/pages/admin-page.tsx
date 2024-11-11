import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import AdminDepartment from '@modules/Admin/admin-department';
import AdminUser from '@modules/Admin/admin-user';
import { AdminUsersList } from '@modules/Admin/admin-users-list';
import { SessionDepartment } from '@modules/Admin/ui/session-department';

const AdminPage = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Филиалы" />
                        <Tab label="Добавить пользователя" />
                        <Tab label="Пользователи" />
                        <Tab label="Телевизоры" />
                    </Tabs>
                </Box>
                <Box
                    sx={{
                        width: '1140px',
                        mr: 'auto',
                        ml: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {value === 0 && <AdminDepartment />}
                    {value === 1 && <AdminUser />}
                    {value === 2 && <AdminUsersList />}
                    {value === 3 && <SessionDepartment />}
                </Box>
            </Box>
        </>
    );
};

export default AdminPage;
