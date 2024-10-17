export interface Queue {
    _id: string;
    ticketNumber: string;
    type: 'TSF' | 'VS' | 'TSY' | 'GR';
    status: 'waiting' | 'in-progress' | 'completed';
    createdAt: string;
    department: string;
}
