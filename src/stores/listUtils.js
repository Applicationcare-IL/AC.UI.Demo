import { defineStore } from 'pinia';

export const useListUtilsStore = defineStore('listUtils', {
    state: () => ({

    }),
    getters: {
        getContactColumns: () => {
            return [
                { name: 'star', type: 'star', header: 'contact.main', class: 'column-star' },
                { name: 'name', type: 'link', to: 'contact', linkParameter: 'id' },
                { name: 'telephone', type: 'text' },
                { name: 'landline', type: 'text' },
                { name: 'email', type: 'text' },
                { name: 'address', type: 'text' },
                { name: 'open_services', type: 'alert', header: 'contact.open-services', class: 'numeric' },
                { name: 'open_tasks', type: 'alert', header: 'contact.open-tasks', class: 'numeric' },
                { name: 'role', type: 'text', header: 'role' },
                { name: 'actions', type: 'actions', header: 'actions', class: 'buttons' }
            ];
        },
        getCustomerColumns: () => {
            return [
                { name: 'star', type: 'star', header: 'customer.main', class: 'column-star' },
                { name: 'id', type: 'link', header: 'customer.number-abbreviation' },
                { name: 'name', type: 'text' },
                { name: 'type', type: 'text', header: 'customer.type' },
                { name: 'open_services', type: 'text', header: 'customer.open-services', class: 'numeric' },
                { name: 'breached_services', type: 'alert', header: 'customer.breached-services', class: 'numeric' },
                { name: 'open_tasks', type: 'text', header: 'customer.open-tasks', class: 'numeric' },
                { name: 'breached_tasks', type: 'alert', header: 'customer.breached-tasks', class: 'numeric' },
                { name: 'classification1', type: 'tags', header: 'classification-1', class: 'tags buttons' },
                { name: 'role', type: 'text', header: 'role' },
                { name: 'actions', type: 'actions', header: 'actions', class: 'buttons' }
            ];
        },
        getServiceColumns: () => {
                return [
                {name: 'service_number', type: 'link', header: 'service.number'},
                {name: 'open_date', type: 'text', header: 'service.open-date'},
                {name: 'due_date', type: 'text', header: 'service.due-date'},
                {name: 'classification_1', type: 'text', header: 'classification-1'},
                {name: 'classification_2', type: 'text', header: 'classification-2'},
                {name: 'classification_3', type: 'text', header: 'classification-3'},
                {name: 'duration', type: 'text', header: 'service.duration'},
                {name: 'in_charge', type: 'link', header: 'service.in-charge'},
                {name: 'team', type: 'text', header: 'service.team'},
                {name: 'SLA', type: 'sla', header: 'service.sla', class: 'sla'},
                {name: 'priority', type: 'priority', header: 'service.priority', class: 'numeric'},
                {name: 'recurring', type: 'text', header: 'service.recurring'},
                {name: 'last_change', type: 'text', header: 'service.last-change'},
                {name: 'closed', type: 'text', header: 'service.date-closed'},
                {name: 'stage', type: 'text', header: 'service.stage'},
                
            ];
        },
        getTaskColumns: () => {
            return [
                { name: 'task_number', type: 'link', header: 'task.number' },
                { name: 'task_type', type: 'text', header: 'task.type' },
                { name: 'family', type: 'text' },
                { name: 'stage', type: 'text' },
                { name: 'sla', type: 'sla', class: 'sla' },
                { name: 'due_date', type: 'text' },
                { name: 'in_charge', type: 'link' },
                { name: 'status', type: 'text' },
                { name: 'notes', type: 'text' }
            ];
        },

    },
    actions: {
        getAlertCellConditionalStyle: (data) =>{
            return [{ 'bg-red-100 text-red-600': data > 0 }];
        },

        getSelectFilterButtonValues: (entityPlural, i18n) => {
            
            return [
                { name: i18n.t('all-entities', { label: entityPlural }), value: 2 },
                { name: i18n.t('my-entities', { label: entityPlural }), value: 1 },
            ]
        },

        getSlaConditionalStyle: (data) => {
            return [
                {
                    'bg-teal-200 text-teal-900': data.SLA === '10 ימים',
                    'bg-yellow-100 text-gray-900': data.SLA === '2 ימים',
                    'bg-red-100 text-red-600 ': data.SLA === '3 ימים',
                    'text-teal-900': data.SLA === 'עמד ביעד',
                    'text-red-600': data.SLA === 'הסתיים בחריגה',
                }
            ];
        },
        getPriorityConditionalStyle: (data) => {
            return [
                'text-blue-600',
                {
                    'bg-blue-75': data.priority === 1 && data.is_active,
                    'bg-blue-50': data.priority === 2 && data.is_active,
                    'bg-blue-25': data.priority === 3 && data.is_active
                }
            ];
        }
    }
});