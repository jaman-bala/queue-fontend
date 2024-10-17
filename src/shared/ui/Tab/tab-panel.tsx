import { TabPanel as TabPanelUI } from '@headlessui/react';
import cls from './tab.module.scss';
import clsx from 'clsx';

interface TabPanelProps {
    classNames?: string;
    children: React.ReactNode;
}

export const TabPanel = (props: TabPanelProps) => {
    const { children, classNames } = props;
    return (
        <TabPanelUI className={clsx(classNames, cls.tabPanel)}>
            {children}
        </TabPanelUI>
    );
};
