import useAuth from '@shared/hooks/useAuth';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
    const { children } = props;
    const { userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            console.log(userId);
            navigate('/');
        }
    }, []);

    return children;
};

export default ProtectedRoute;
