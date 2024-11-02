import axios from 'axios';

const token = localStorage.getItem('token');

export const instance = axios.create({
    baseURL: 'https://dev-queue.tsvs.kg/',
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
