import clsx from 'clsx';
import cls from './select.module.scss';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Field,
} from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import DownArrow from '@shared/assets/icons/alt-arrow-down-svgrepo-com.svg';

export interface SelectOption {
    content: string;
    id: number | string;
}

interface SelectProps {
    onChange: (item: SelectOption) => void;
    disabled?: boolean;
    loading?: boolean;
    classNames?: string;
    label?: string;
    fullWidth?: boolean;
    items: SelectOption[];
}

export const Select = (props: SelectProps) => {
    const { onChange, classNames, items, fullWidth, label, disabled, loading } =
        props;
    const [selectedValue, setSelectedValue] = useState<SelectOption>(items[0]);
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const modes = {
        [cls.fullWidth]: fullWidth,
        [cls.open]: open,
        [cls.loading]: loading,
        [cls.disabled]: disabled,
    };

    const icon = <Icon className={cls.icon} Svg={DownArrow} />;

    const onChangeHandler = (value: SelectOption) => {
        setSelectedValue(value);
        onChange(value);
        setOpen(false);
    };

    const openHandler = () => {
        setOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <Field disabled={disabled} className={clsx(cls.field, modes)}>
            {label && <p className={clsx(cls.label, modes)}>{label}</p>}
            <div ref={ref}>
                <Listbox value={selectedValue} onChange={onChangeHandler}>
                    <ListboxButton
                        className={clsx(classNames, cls.listButton, modes)}
                        onClick={openHandler}
                    >
                        {selectedValue.content}
                        {icon}
                    </ListboxButton>
                    <ListboxOptions
                        className={clsx(cls.listboxOptions, modes)}
                        anchor="bottom"
                    >
                        {items.map((person) => (
                            <ListboxOption
                                key={person.id}
                                value={person}
                                className={clsx(cls.listOption, modes)}
                            >
                                {person.content}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Listbox>
            </div>
        </Field>
    );
};
