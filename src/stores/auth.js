import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { AuthService } from '@/service/AuthService';

const router = useRouter();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null,
    }),
    actions: {
        login(email, password) {
            AuthService.login(email, password);
            this.isAuthenticated = true;
        },
        logout() {
            this.isAuthenticated = false;
            router.push('/account/login');
        },
    },
});