import axiosConfig from '@/service/axiosConfig';

export const AuthService = {
    login(email, password) {
        console.log(axiosConfig)
        axiosConfig.post('/auth/login', { email, password })
            .then((response) => {
                console.log(response);
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    },
};
