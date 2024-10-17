import { Tab, TabGroup, TabList } from '@headlessui/react';
import clsx from 'clsx';
import cls from './tab.module.scss';

interface TabsProps {
    defaultIndex?: number;
    classNames?: string;
    disabled?: number;
    tabs: string[];
    children: React.ReactNode;
}

export const Tabs = (props: TabsProps) => {
    const { defaultIndex = 0, classNames, tabs, disabled, children } = props;

    const modes = {
        [cls.disabled]: disabled,
    };
    return (
        <TabGroup defaultIndex={defaultIndex}>
            <div className={clsx(cls.tabsContainer, classNames)}>
                <TabList className={cls.tabList}>
                    {tabs.map((tab, idx) => (
                        <Tab
                            as="button"
                            key={idx}
                            className={({ selected }) =>
                                clsx(cls.tab, selected && cls.activeTab, modes)
                            }
                            disabled={idx === disabled}
                        >
                            {tab}
                        </Tab>
                    ))}
                </TabList>
                {children}
            </div>
        </TabGroup>
    );
};
