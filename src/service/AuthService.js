import axiosConfig from '@/service/axiosConfig';

export const AuthService = {
    login(email, password) {
        // console.log(axiosConfig)
        return axiosConfig.post('/auth/login', { email, password })
    },
};
