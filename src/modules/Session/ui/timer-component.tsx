import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@shared/types/redux-types';
import { updateTime } from '../model/currentQueue';

export const TimerComponent = () => {
    const dispatch: AppDispatch = useDispatch();
    const time = useSelector((state: RootState) => state.currentQueue.time);
    const sessionStatus = useSelector(
        (state: RootState) => state.currentQueue.sessionStatus,
    );

    console.log(time);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (sessionStatus === 'in-progress') {
            intervalId = setInterval(() => {
                dispatch(updateTime());
            }, 1000);
        }

        if (sessionStatus === 'serviced' && intervalId) {
            clearInterval(intervalId);
        }
        console.log(sessionStatus === 'serviced' && intervalId);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [dispatch, sessionStatus]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    if (sessionStatus === 'available' || sessionStatus === 'calling') {
        return <span>--:--</span>;
    }

    return <span>{formatTime(time)}</span>;
};
