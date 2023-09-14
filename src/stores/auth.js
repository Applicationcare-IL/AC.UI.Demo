import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { AuthService } from '@/service/AuthService';

const router = useRouter();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: localStorage.getItem('isAuthenticated'),
        user: JSON.parse(localStorage.getItem('user')),
        token: localStorage.getItem("token")
    }),
    getters:{
        userFullName(){
            return this.user.name + ' ' + this.user.surname;
        }
    },
    actions: {
        login(email, password) {

            return Promise.resolve(AuthService.login(email, password)
                .then((response) => {
                    console.log(response);
                    this.isAuthenticated = true;
                    this.token = response.data.data.token;
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('isAuthenticated', true);
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
            localStorage.clear();

            // router.push('/login');
        },
        userData() {
            return Promise.resolve(AuthService.userData()
                .then((response) => {
                    console.log(response);
                    this.user = response.data.data;
                    localStorage.setItem('user', JSON.stringify(this.user));
                })
                .catch((error) => {
                    console.log(error);
                }
                ));
        }
    },
});