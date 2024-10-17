import { createContext, ReactNode, useState } from 'react';

interface PrintData {
    ticket?: string;
    createdAt?: string;
    departmentName?: string;
}

interface PrintContextData {
    printData?: PrintData;
    setPrintData?: (theme: PrintData) => void;
}

export const PrintContext = createContext<PrintContextData>({
    printData: {
        ticket: 'TS0001',
        createdAt: '23.09.2024, 20:48',
    },
});

const PrintProvider = ({ children }: { children: ReactNode }) => {
    const [printData, setPrintData] = useState<PrintData>({});

    return (
        <PrintContext.Provider value={{ printData, setPrintData }}>
            {children}
        </PrintContext.Provider>
    );
};

export default PrintProvider;
