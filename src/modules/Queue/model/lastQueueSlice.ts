import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PrintData } from './types';
import type { QueueType, StatusTypes } from '@shared/types/queues-types';
import { instance } from '@shared/utils/axios-instance';
import { AxiosError } from 'axios';

interface InitialStateType {
    tickets: QueueType[] | null;
    status?: StatusTypes;
    message?: string;
    error?: string;
    printData?: PrintData;
}

export const getAllWaitingQueues = createAsyncThunk<QueueType[], string>(
    'lastQueues/getAllWaitingQueues',
    async (departmentId: string, thunkApi) => {
        const { rejectWithValue } = thunkApi;

        try {
            const response = await instance.get(`queues/${departmentId}`);

            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error);
                rejectWithValue(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    },
);

const initialState: InitialStateType = {
    tickets: [],
    status: 'idle',
    message: '',
    error: undefined,
};

const lastQueuesSlice = createSlice({
    name: 'lastQueues',
    initialState,
    reducers: {
        addTicket: (state, action: PayloadAction<QueueType>) => {
            state.tickets?.filter(
                (ticket) => action.payload.type !== ticket.type,
            );
            state.tickets?.push(action.payload);
        },
        setPrintData: (state, action: PayloadAction<PrintData>) => {
            state.printData = action.payload;
        },
        removeTicket: (state, action: PayloadAction<QueueType>) => {
            const foundIndex = state.tickets?.findIndex(
                (ticket) => ticket.ticketNumber === action.payload.ticketNumber,
            );
            if (foundIndex !== 1 && foundIndex !== undefined) {
                state.tickets?.splice(foundIndex, 1);
            }
        },
        setLoading: (state, action: PayloadAction<StatusTypes>) => {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllWaitingQueues.pending, (state) => {
            state.status = 'pending';
        });
        builder.addCase(getAllWaitingQueues.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.tickets = action.payload;
        });
        builder.addCase(getAllWaitingQueues.rejected, (state, action) => {
            state.status = 'failed';
            if (action.payload === 'string') {
                state.error = action.payload;
            }
        });
    },
});

export const { addTicket, setPrintData, removeTicket, setLoading } =
    lastQueuesSlice.actions;

export default lastQueuesSlice.reducer;
