import { SessionStatusType, StatusTypes } from '@shared/types/queues-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { QueueType, SessionType } from '@shared/types/queues-types';
import { instance } from '@shared/utils/axios-instance';

interface InitialStateTypes {
    ticket: QueueType | undefined;
    session: SessionType | undefined;
    status: StatusTypes;
    noAvailableTicket: boolean;
    time: number;
    sessionStatus?: SessionStatusType;
}

interface QueueResponse {
    ticket: QueueType | boolean;
    session: SessionType;
}

interface GetQueueParams {
    userId: string;
    departmentId: string;
}

export const getCurrentTicket = createAsyncThunk<QueueResponse, GetQueueParams>(
    'currentQueue/getCurrentTicket',
    async ({ userId, departmentId }, { rejectWithValue }) => {
        try {
            const response = await instance.get<QueueResponse>(
                `/queues/specialist/${userId}`,
                {
                    params: { departmentId },
                },
            );
            console.log(response);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || {
                    message: 'Ошибка при получении данных',
                },
            );
        }
    },
);

const initialState: InitialStateTypes = {
    ticket: undefined,
    session: undefined,
    status: 'idle',
    noAvailableTicket: false,
    time: 0,
};

const currentQueueSlice = createSlice({
    name: 'currentQueue',
    initialState,
    reducers: {
        resetTimer(state) {
            state.time = 0;
        },
        updateTime(state) {
            state.time = state.time + 1;
        },
        startService(state) {
            state.sessionStatus = 'in-progress';
        },
        completeService(state) {
            state.sessionStatus = 'serviced';
        },
        startLoading(state) {
            state.status = 'pending';
        },
        endLoading(state) {
            state.status = 'succeeded';
        },
        failedLoading(state) {
            state.status = 'failed';
        },
        updateTicket(state, action) {
            state.ticket = action.payload.ticket as QueueType;
            state.session = action.payload.specialist;
            state.sessionStatus = action.payload.specialist.status;
        },
        updateSession(state, action) {
            state.session = action.payload.specialist;
            state.sessionStatus = action.payload.specialist.status;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCurrentTicket.pending, (state) => {
            state.status = 'pending';
            state.noAvailableTicket = false;
        });
        builder.addCase(getCurrentTicket.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.sessionStatus = action.payload.session.status;

            if (action.payload.ticket === false) {
                state.noAvailableTicket = true;
                state.ticket = undefined;
            } else {
                state.ticket = action.payload.ticket as QueueType;
                state.noAvailableTicket = false;
            }

            state.session = action.payload.session;
        });
        builder.addCase(getCurrentTicket.rejected, (state) => {
            state.status = 'failed';
            state.noAvailableTicket = false;
        });
    },
});

export const {
    resetTimer,
    updateTime,
    startService,
    startLoading,
    endLoading,
    failedLoading,
    completeService,
    updateTicket,
    updateSession,
} = currentQueueSlice.actions;

export default currentQueueSlice.reducer;
