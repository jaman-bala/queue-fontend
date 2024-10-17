import { Outlet } from 'react-router-dom';
import Menu from '@modules/Menu/ui/menu';

const LayoutPage = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Menu />
            <Outlet />
        </div>
    );
};

export default LayoutPage;
