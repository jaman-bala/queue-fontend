import { Modal, Box, TextField, Button } from '@mui/material';
import { instance } from '@shared/utils/axios-instance';
import { useEffect, useState } from 'react';

interface EditModalDepartmentsProps {
    itemId: string | undefined;
    handleCloseModal: (state: boolean) => void;
    open: boolean;
    setOpenSnackbar: (state: boolean) => void;
    setSnackbarMessage: (state: string) => void;
    setSnackbarSeverity: (state: 'success' | 'error') => void;
    handleEditDepartments: (item: { _id: string; name: string }) => void;
}

export const EditModalDepartments = (props: EditModalDepartmentsProps) => {
    const {
        itemId,
        handleCloseModal,
        open,
        setOpenSnackbar,
        setSnackbarMessage,
        setSnackbarSeverity,
        handleEditDepartments,
    } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    const fetchDepartmentsList = async () => {
        setLoading(true);
        try {
            const response = await instance.get(`departments/${itemId}`);

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу загрузить филиал. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setLoading(false);
            } else {
                setName(response.data.department.name);
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

    const editDepartment = async (name: string) => {
        setLoading(true);
        try {
            const response = await instance.put(`departments/${itemId}`, {
                name: name,
            });

            if (!response.data) {
                setSnackbarMessage(
                    'Не могу изменить филиал. Попробуйте обновить страницу.',
                );
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setLoading(false);
            } else {
                handleEditDepartments(response.data.editedDepartment);
                setLoading(false);
                handleCloseModal(false);
            }
        } catch (error) {
            setSnackbarMessage('Ошибка при загрузке Филиалов');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (itemId) {
            fetchDepartmentsList();
        }
    }, [itemId]);

    const handleClose = () => handleCloseModal(false);

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
                        label="Департамент"
                        id="fullWidth"
                        variant="filled"
                        value={name}
                        disabled={loading}
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
                        disabled={loading}
                        variant="contained"
                        onClick={() => editDepartment(name)}
                    >
                        Изменить
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};
