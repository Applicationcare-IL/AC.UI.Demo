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
                    name: 'dashboard',
                    exact: true,
                    component: () => import('@/views/user/Dashboard.vue'),
                   
                },
                // {
                //     path: '/Headers',
                //     name: 'Headers',
                //     component: () => import('@/views/Headers.vue'),
                // },
                // {
                //     path: '/Buttons',
                //     name: 'Buttons',
                //     component: () => import('@/views/Buttons.vue'),
                // },
                // {
                //     path: '/Tables',
                //     name: 'Tables',
                //     component: () => import('@/views/Tables.vue'),
                // },
                {
                    path: '/Dashboard',
                    name: 'Dashboard',
                    component: () => import('@/views/user/Dashboard.vue'),
                },
                {
                    path: '/Customers',
                    name: 'Customers',
                    component: () => import('@/views/user/lists/Customers.vue'),
                },
                {
                    path: '/Contacts',
                    name: 'Contacts',
                    component: () => import('@/views/user/lists/Contacts.vue'),
                },
                {
                    path: '/new-contact',
                    name: 'newContact',
                    component: () => import('@/views/user/forms/Contact.vue'),
                },
                {
                    path: '/new-customer',
                    name: 'newCustomer',
                    component: () => import('@/views/user/forms/Customer.vue'),
                },
                {
                    path: '/Services',
                    name: 'Services',
                    component: () => import('@/views/user/lists/Services.vue'),
                },
                {
                    path: '/Tasks',
                    name: 'Tasks',
                    component: () => import('@/views/user/lists/Tasks.vue'),
                },

            ]
        },
    ]
});

export default router;
