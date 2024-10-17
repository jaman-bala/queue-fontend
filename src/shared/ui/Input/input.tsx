import { InputHTMLAttributes, useState } from 'react';
import { Field, Input as InputUI, Label } from '@headlessui/react';
import clsx from 'clsx';
import cls from './input.module.scss';

type HTMLInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'readOnly'
>;

interface InputProps extends HTMLInputProps {
    classNames?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly?: boolean;
    label?: string;
    fullWidth?: boolean;
    disabled?: boolean;
}

export const Input = (props: InputProps) => {
    const {
        classNames,
        readonly,
        value,
        onChange,
        label,
        disabled,
        fullWidth,
        ...otherProps
    } = props;

    const [focused, setFocused] = useState(false);

    const modes = {
        [cls.focused]: focused,
        [cls.disabled]: disabled,
        [cls.fullWidth]: fullWidth,
    };

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
    };

    return (
        <Field className={clsx(cls.inputWrapper, modes)}>
            <InputUI
                className={clsx(cls.input, classNames, modes)}
                value={value}
                disabled={disabled}
                readOnly={readonly}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={onChangeHandler}
                placeholder=" "
                {...otherProps}
            />
            <Label className={cls.label}>{label}</Label>
        </Field>
    );
};
