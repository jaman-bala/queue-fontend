import { Button as ButtonUI } from '@headlessui/react';
import {
    ButtonHTMLAttributes,
    FC,
    memo,
    ReactNode,
    SVGProps,
    useMemo,
} from 'react';
import clsx from 'clsx';
import cls from './button.module.scss';
import { Icon } from '@shared/ui/Icon';
import AddIcon from '@shared/assets/icons/add-square-svgrepo-com.svg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    classNames?: string;
    disabled?: boolean;
    loading?: boolean;
    withIcon?: boolean;
    icon?: FC<SVGProps<SVGSVGElement>>;
    children?: ReactNode;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary' | 'flat' | 'secondary-dark';
    onClickHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = memo((props: ButtonProps) => {
    const {
        children,
        classNames,
        disabled,
        withIcon,
        icon = AddIcon,
        loading,
        fullWidth,
        variant = 'primary',
        onClickHandler,
        ...otherProps
    } = props;

    const modes = useMemo(
        () => ({
            [cls.disabled]: disabled,
            [cls.loading]: loading,
            [cls[variant]]: true,
            [cls.withIcon]: !loading ? withIcon : false,
            [cls.fullWidth]: fullWidth,
        }),
        [loading],
    );

    const iconComponent = withIcon && !loading && (
        <Icon className={cls.icon} Svg={icon} />
    );

    const content = loading ? <span className={cls.loader}></span> : children;

    return (
        <ButtonUI
            className={clsx(cls.button, classNames, modes)}
            disabled={disabled || loading}
            onClick={onClickHandler}
            {...otherProps}
        >
            {iconComponent}
            {content}
        </ButtonUI>
    );
});
