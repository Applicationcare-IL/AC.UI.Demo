import { defineStore } from 'pinia';

export const useListUtilsStore = defineStore('listUtils', {
    state: () => ({

    }),
    getters: {
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
                {name: 'recurrent', type: 'text', header: 'service.recurrent'},
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
});