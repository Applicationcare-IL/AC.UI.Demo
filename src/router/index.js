import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'Home',
                    compocomponent: () => import('@/views/user/Dashboard.vue'),
                   
                },
                {
                    path: '/Headers',
                    name: 'Headers',
                    component: () => import('@/views/Headers.vue'),
                },
                {
                    path: '/Buttons',
                    name: 'Buttons',
                    component: () => import('@/views/Buttons.vue'),
                },
                {
                    path: '/Tables',
                    name: 'Tables',
                    component: () => import('@/views/Tables.vue'),
                },
                {
                    path: '/Dashboard',
                    name: 'Dashboard',
                    component: () => import('@/views/user/Dashboard.vue'),
                },
                {
                    path: '/Customers',
                    name: 'Customers',
                    component: () => import('@/views/user/Customers.vue'),
                },
                {
                    path: '/Contacts',
                    name: 'Contacts',
                    component: () => import('@/views/user/Contacts.vue'),
                },
                {
                    path: '/Services',
                    name: 'Services',
                    component: () => import('@/views/user/Services.vue'),
                },
                {
                    path: '/Tasks',
                    name: 'Tasks',
                    component: () => import('@/views/user/Tasks.vue'),
                },

            ]
        },
    ]
});

export default router;
