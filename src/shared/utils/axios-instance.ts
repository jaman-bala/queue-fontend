import axios from 'axios';

const token = localStorage.getItem('token');

export const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
