import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { AuthService } from '@/service/AuthService';

const router = useRouter();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: localStorage.getItem('isAuthenticated'),
        user: null,
        token: localStorage.getItem("token")
    }),
    actions: {
        login(email, password) {

            return Promise.resolve(AuthService.login(email, password)
                .then((response) => {
                    console.log(response);
                    this.isAuthenticated = true;
                    this.token = response.data.data.token;
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('isAuthenticated', this.token);
                })
                .catch((error) => {
                    console.log(error);
                }));
        },
        logout() {
            this.isAuthenticated = false;
            this.token = null;
            localStorage.setItem('isAuthenticated', false);
            localStorage.setItem('token', null);
            router.push('/account/login');
        },
    },
});