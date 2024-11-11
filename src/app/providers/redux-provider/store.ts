import { configureStore } from '@reduxjs/toolkit';
import lastQueueSlice from '@modules/Queue/model/lastQueueSlice';
import inprogressTicketsSlice from '@modules/Ticket/model/inprogress-tickets-slice';
import currentQueueSlice from '@modules/Session/model/currentQueue';
import ticketAdminSlice from '@modules/Admin/model/ticket-admin';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

const rootReducer = combineReducers({
    lastQueues: lastQueueSlice,
    inProgressTickets: inprogressTicketsSlice,
    currentQueue: currentQueueSlice,
    ticketAdmin: ticketAdminSlice,
});

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);
