import { FC, memo, SVGProps } from 'react';
import clsx from 'clsx';
import cls from './icon.module.scss';

interface IconProps extends SVGProps<SVGSVGElement> {
    classNames?: string;
    Svg: string | FC<SVGProps<SVGSVGElement>>;
    sx?: Record<string, string>;
}

export const Icon = memo((props: IconProps) => {
    const { Svg, classNames, sx, ...otherProps } = props;
    return (
        <Svg
            className={clsx(cls.icon, classNames)}
            {...otherProps}
            style={{ ...sx }}
        />
    );
});
