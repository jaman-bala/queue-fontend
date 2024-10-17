import { TabPanels as TabPanelsUI } from '@headlessui/react';
import cls from './tab.module.scss';
import clsx from 'clsx';

interface TabPanelsProps {
    classNames?: string;
    children: React.ReactNode;
}

export const TabPanels = (props: TabPanelsProps) => {
    const { children, classNames } = props;
    return (
        <TabPanelsUI className={clsx(classNames, cls.tabPanels)}>
            {children}
        </TabPanelsUI>
    );
};
