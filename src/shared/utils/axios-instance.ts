import axios from 'axios';

const token = localStorage.getItem('token');

export const instance = axios.create({
    baseURL: 'https://dev-test.tsvs.kg/',
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
