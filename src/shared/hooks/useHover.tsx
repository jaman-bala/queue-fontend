import { RefObject, useState } from 'react';
import { useEventListener } from './useEventListener';

export function useHover(ref: RefObject<Element>) {
    const [hovered, setHovered] = useState(false);

    console.log(ref.current);

    if (ref.current) {
        useEventListener<MouseEvent>(
            'mouseover',
            () => setHovered(true),
            ref.current,
        );
        useEventListener<MouseEvent>(
            'mouseout',
            () => setHovered(false),
            ref.current,
        );
    }

    return hovered;
}
