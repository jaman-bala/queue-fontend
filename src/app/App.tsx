import PrintProvider from './providers/print-provider/print-provider';
import { StateProvider } from './providers/redux-provider/provider';
import RoutesProvider from './providers/router/router-provider';

function App() {
    return (
        <StateProvider>
            <PrintProvider>
                <RoutesProvider />
            </PrintProvider>
        </StateProvider>
    );
}

export default App;
