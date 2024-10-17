import AdminPage from '@pages/admin-page';
import ErrorPage from '@pages/error-page';
import LayoutPage from '@pages/layout-page';
import LoginPage from '@pages/login-page';
import OperatorPage from '@pages/operator2-page';
import PrintPage from '@pages/print-page';
import ProtectedRoute from '@pages/protected-routes';
import { SpecialistPage } from '@pages/specialist2-page';
import { SpectatorPage } from '@pages/spectator2-page';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutPage />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
            {
                path: 'operator',
                element: (
                    <ProtectedRoute>
                        <OperatorPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'spectator',
                element: (
                    <ProtectedRoute>
                        <SpectatorPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'specialist',
                element: (
                    <ProtectedRoute>
                        <SpecialistPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute>
                        <AdminPage />,
                    </ProtectedRoute>
                ),
            },
        ],
    },
    { path: '/print', element: <PrintPage />, errorElement: <ErrorPage /> },
]);
