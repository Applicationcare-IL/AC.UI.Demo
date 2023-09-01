import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
    // baseURL: "http://127.0.0.1:8000/api",
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

instance.interceptors.request.use(
    config => {
        const authStore = useAuthStore();
        if (authStore.isAuthenticated) {
            config.headers.Authorization = `Bearer ${authStore.token} `;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default instance;