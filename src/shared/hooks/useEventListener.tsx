import { useEffect, useRef } from 'react';

export function useEventListener<T extends Event>(
    eventType: string,
    callback: (e: T) => void,
    element: EventTarget | null = window,
) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!element) return;
        const handler = (event: Event) => callbackRef.current(event as T);
        element.addEventListener(eventType, handler as EventListener);

        return () =>
            element.removeEventListener(eventType, handler as EventListener);
    }, [eventType, element]);
}
