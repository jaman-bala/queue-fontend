import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { QueueType, StatusTypes } from '@shared/types/queues-types';
import { instance } from '@shared/utils/axios-instance';
import { AxiosError } from 'axios';

interface InProgressTicket extends QueueType {
    windowNumber: number;
    status: 'calling' | 'in-progress';
}

interface InitialStateType {
    tickets: InProgressTicket[];
    status: StatusTypes;
    error: unknown;
}

export const getInProgressQueues = createAsyncThunk<InProgressTicket[], string>(
    'inprogressTickets/getInProgressQueues',
    async (departmentId: string, thunkApi) => {
        const { rejectWithValue } = thunkApi;
        try {
            const response = await instance.get(
                `queues/${departmentId}/inprogress`,
            );

            if (response.status === 204) {
                return [];
            }

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
    error: undefined,
};

const inprogressTicketsSclice = createSlice({
    name: 'inprogressTickets',
    initialState,
    reducers: {
        updateInProgressTickets(state, action) {
            const { windowNumber, ticket } = action.payload;
            const existingTicket = state.tickets.find(
                (item) => item.windowNumber === windowNumber,
            );

            if (existingTicket) {
                existingTicket.ticketNumber = ticket.ticketNumber;
                existingTicket.status = ticket.status;
            } else {
                state.tickets.push({
                    ...ticket,
                    windowNumber,
                });
            }
            state.tickets.sort((a, b) => (a.status === 'calling' ? -1 : 1));
        },
        deleteInProgressTicket(state, action) {
            const { windowNumber } = action.payload;
            const newState = state.tickets.filter(
                (item) => item.windowNumber !== windowNumber,
            );
            state.tickets = newState;
            state.tickets.sort((a, b) => (a.status === 'calling' ? -1 : 1));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getInProgressQueues.pending, (state) => {
            state.status = 'pending';
        });
        builder.addCase(getInProgressQueues.fulfilled, (state, action) => {
            const tickets = action.payload.sort((a, b) => {
                if (a.status === 'calling' && b.status !== 'calling') {
                    return -1;
                }
                if (a.status !== 'calling' && b.status === 'calling') {
                    return 1;
                }
                return 0;
            });
            state.tickets = tickets;
            state.status = 'succeeded';
        });
        builder.addCase(getInProgressQueues.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    },
});

export const { updateInProgressTickets, deleteInProgressTicket } =
    inprogressTicketsSclice.actions;

export default inprogressTicketsSclice.reducer;
