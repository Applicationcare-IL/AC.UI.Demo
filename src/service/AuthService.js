import axiosConfig from '@/service/axiosConfig';

export const AuthService = {
    login(email, password) {
        return axiosConfig.post('/auth/login', { email, password })
    },
    userData() {
        return axiosConfig.get('/auth/profile')
    }
};
