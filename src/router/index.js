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
                    path: '/Contacts',
                    name: 'Contacts',
                    component: () => import('@/views/user/lists/Contacts.vue'),
                },
                {
                    path: '/new-contact',
                    name: 'newContact',
                    component: () => import('@/views/user/forms/new/Contact.vue'),
                },
                {
                    path: '/contact/:id',
                    name: 'contactDetail',
                    component: () => import('@/views/user/forms/detail/Contact.vue'),
                },
                {
                    path: '/Customers',
                    name: 'Customers',
                    component: () => import('@/views/user/lists/Customers.vue'),
                },
                {
                    path: '/new-customer',
                    name: 'newCustomer',
                    component: () => import('@/views/user/forms/new/Customer.vue'),
                },
                {
                    path: '/customer/:id',
                    name: 'customerDetail',
                    component: () => import('@/views/user/forms/detail/Customer.vue'),
                },
                {
                    path: '/Services',
                    name: 'Services',
                    component: () => import('@/views/user/lists/Services.vue'),
                },
                {
                    path: '/new-service',
                    name: 'newService',
                    component: () => import('@/views/user/forms/new/Service.vue'),
                },
                {
                    path: '/Tasks',
                    name: 'Tasks',
                    component: () => import('@/views/user/lists/Tasks.vue'),
                },
                {
                    path: '/new-task',
                    name: 'newTask',
                    component: () => import('@/views/user/forms/new/Task.vue'),
                },

            ]
        },
    ]
});

export default router;
