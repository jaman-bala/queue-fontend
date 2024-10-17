import { QueuesTypes } from '@shared/types/queues-types';

interface ButtonQueueListType {
    type: QueuesTypes;
    text: string;
}
export const buttonQueueList: ButtonQueueListType[] = [
    { type: 'TSF', text: 'Регистрация ТС Физ. лиц' },
    { type: 'TSY', text: 'Регистрация ТС Юр. лиц' },
    { type: 'VS', text: 'Регистрация ВС' },
    { type: 'GR', text: 'Регистрация ГР' },
];
