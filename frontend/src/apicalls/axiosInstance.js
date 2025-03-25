import axios from 'axios';

export const axiosInstance = axios.create({
    // baseURL: 'http://localhost:5000/', 
    baseURL: 'https://sendjobmail.vercel.app',
    headers: {
        'Content-Type': 'application/json', 
      },
});
