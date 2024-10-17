import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

const RoutesProvider = () => {
    return <RouterProvider router={router} />;
};

export default RoutesProvider;
