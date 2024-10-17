export type QueuesTypes = 'TSF' | 'TSY' | 'VS' | 'GR';
export type QueuesTypesRu = 'ТС-Ф' | 'ТС-Ю' | 'ВС' | 'ГР';
export type SessionStatusType =
    | 'available'
    | 'calling'
    | 'in-progress'
    | 'serviced';
export interface QueueType {
    _id: string;
    type: 'TSF' | 'TSY' | 'VS' | 'GR';
    ticketNumber: string;
    status: 'waiting' | 'calling' | 'in-progress' | 'completed';
    createdAt: string;
    startServiceTime: string;
    endServiceTime: string;
    department: string;
}
export interface SessionType {
    _id: string;
    userInfo: string;
    department: string;
    ticketsType: 'TS' | 'VS';
    windowNumber: number;
    status: SessionStatusType;
}
export type StatusTypes = 'idle' | 'pending' | 'succeeded' | 'failed';
