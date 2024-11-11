import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { StatusTypes } from '@shared/types/queues-types';
import { instance } from '@shared/utils/axios-instance';
import { AxiosError } from 'axios';

interface InProgressTicket {
    _id: string;
    sessionId: string;
    ticketNumber: string;
    windowNumber: number;
    status: 'calling' | 'in-progress';
}

interface Department {
    _id: string;
    name: string;
}

interface InitialStateType {
    tickets: InProgressTicket[];
    departments: Department[];
    status: StatusTypes;
    error: unknown;
}

export const getInProgressQueues = createAsyncThunk<InProgressTicket[], string>(
    'ticketAdminSlice/getInProgressQueues',
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

export const getAllDepartments = createAsyncThunk<Department[]>(
    'ticketAdminSlice/getAllDepartments',
    async (_, thunkApi) => {
        const { rejectWithValue } = thunkApi;
        try {
            const response = await instance.get(`departments`);

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
    departments: [],
    status: 'idle',
    error: undefined,
};

const ticketAdminSlice = createSlice({
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
            state.tickets.sort((a) => (a.status === 'calling' ? -1 : 1));
        },
        deleteInProgressTicket(state, action) {
            const { windowNumber } = action.payload;
            const newState = state.tickets.filter(
                (item) => item.windowNumber !== windowNumber,
            );
            state.tickets = newState;
            state.tickets.sort((a) => (a.status === 'calling' ? -1 : 1));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getInProgressQueues.pending, (state) => {
            state.status = 'pending';
        });
        builder.addCase(getInProgressQueues.fulfilled, (state, action) => {
            console.log(action.payload);
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
        builder.addCase(getAllDepartments.pending, (state) => {
            state.status = 'pending';
        });
        builder.addCase(getAllDepartments.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.departments = action.payload;
        });
        builder.addCase(getAllDepartments.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    },
});

export const { updateInProgressTickets, deleteInProgressTicket } =
    ticketAdminSlice.actions;

export default ticketAdminSlice.reducer;
