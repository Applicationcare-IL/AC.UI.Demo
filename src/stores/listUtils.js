import { defineStore } from 'pinia';

export const useListUtilsStore = defineStore('listUtils', {
    state: () => ({
        listRowsPerPage: [
            { label: '15', value: 15 },
            { label: '30', value: 30 },
            { label: '50', value: 50 },
            { label: '100', value: 100 },
        ],
        rows: 15,
    }),
    getters: {
        getContactColumns: () => {
            return [
                { name: 'star', type: 'star', header: 'contact.main', class: 'column-star' },
                { name: 'name', type: 'link', to: 'contact', linkParameter: 'id', class: 'link-col' },
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
        getContactDetailColumns: () => {
            return [
                { name: 'star', type: 'star', header: 'contact.main', class: 'column-star' },
                { name: 'name', type: 'link', to: 'contact', linkParameter: 'id', class: 'link-col' },
                { name: 'telephone', type: 'text' },
                { name: 'email', type: 'text' },
                { name: 'role', type: 'text', header: 'role' },
            ];
        },
        getCustomerColumns: () => {
            return [
                { name: 'star', type: 'star', header: 'customer.main', class: 'column-star' },
                { name: 'id', type: 'link', header: 'customer.number-abbreviation', class: 'link-col' },
                { name: 'name', type: 'text' },
                { name: 'type', type: 'option-set', header: 'customer.type' },
                { name: 'open_services', type: 'text', header: 'customer.open-services', class: 'numeric' },
                { name: 'breached_services', type: 'alert', header: 'customer.breached-services', class: 'numeric' },
                { name: 'open_tasks', type: 'text', header: 'customer.open-tasks', class: 'numeric' },
                { name: 'breached_tasks', type: 'alert', header: 'customer.breached-tasks', class: 'numeric' },
                { name: 'service_areas', type: 'tags', header: 'service_areas', class: 'tags buttons' },
                { name: 'role', type: 'text', header: 'role' },
                { name: 'actions', type: 'actions', header: 'actions', class: 'buttons' }
            ];
        },

        getCustomerDetailColumns: () => {
            return [
                { name: 'star', type: 'star', header: 'customer.main', class: 'column-star' },
                { name: 'id', type: 'link', header: 'customer.number-abbreviation', class: 'link-col' },
                { name: 'name', type: 'text' },
                { name: 'type', type: 'option-set', header: 'customer.type' },
                { name: 'open_services', type: 'text', header: 'customer.open-services', class: 'numeric' },
                { name: 'breached_services', type: 'alert', header: 'customer.breached-services', class: 'numeric' },
                { name: 'open_tasks', type: 'text', header: 'customer.open-tasks', class: 'numeric' },
                { name: 'breached_tasks', type: 'alert', header: 'customer.breached-tasks', class: 'numeric' },
                { name: 'service_areas', type: 'tags', header: 'service_areas', class: 'tags buttons' },
                { name: 'role', type: 'text', header: 'role' },
                { name: 'actions', type: 'actions', header: 'actions', class: 'buttons' }
            ];
        },

        getServiceColumns: () => {
            return [
                { name: 'service_number', type: 'link', header: 'service.number', class: 'link-col' },
                { name: 'open_date', type: 'text', header: 'service.open-date' },
                { name: 'due_date', type: 'text', header: 'service.due-date' },
                { name: 'classification_1', type: 'text', header: 'classification-1' },
                { name: 'classification_2', type: 'text', header: 'classification-2' },
                { name: 'classification_3', type: 'text', header: 'classification-3' },
                { name: 'duration', type: 'text', header: 'service.duration' },
                { name: 'owner', type: 'link', header: 'service.owner', class: 'link-col' },
                { name: 'team', type: 'text', header: 'service.team' },
                { name: 'SLA', type: 'sla', header: 'service.sla', class: 'sla' },
                { name: 'priority', type: 'priority', header: 'service.priority', class: 'numeric' },
                { name: 'recurring', type: 'text', header: 'service.recurring' },
                { name: 'last_change', type: 'text', header: 'service.last-change' },
                { name: 'closed', type: 'text', header: 'service.date-closed' },
                { name: 'stage', type: 'text', header: 'service.stage' },

            ];
        },
        getTaskColumns: () => {
            return [
                { name: 'task_number', type: 'link', header: 'task.number', class: 'link-col' },
                { name: 'task_type', type: 'text', header: 'task.type' },
                { name: 'family', type: 'text' },
                { name: 'stage', type: 'text' },
                { name: 'sla', type: 'sla', class: 'sla' },
                { name: 'due_date', type: 'text' },
                { name: 'owner', type: 'link', class: 'link-col' },
                { name: 'status', type: 'text' },
                { name: 'notes', type: 'text' }
            ];
        },

    },
    actions: {
        getAlertCellConditionalStyle: (data) => {
            return [{ 'bg-red-100 text-red-600': data > 0 }];
        },

        getSelectFilterButtonValues: (entityPlural, i18n) => {
            return [
                { name: i18n.t('all-entities', { label: entityPlural }), value: 2 },
                { name: i18n.t('my-entities', { label: entityPlural }), value: 1 },
            ]
        },

        getSlaConditionalStyle: (sla) => {
            console.log(sla);
            return [
                {
                    'bg-teal-200 text-teal-900': sla === 'no_breach',
                    'bg-yellow-100 text-gray-900': sla === 'near_breach',
                    'bg-red-100 text-red-600 ': sla === 'breach',
                    'text-teal-900': sla === 'עמד ביעד',
                    'text-red-600': sla === 'הסתיים בחריגה',
                }
            ];
        },
        getStatusConditionalStyle: (status) => {
            return [
                {
                    'bg-green-200 text-green-900': status === 'active' | status === 'open',
                    'bg-yellow-100 text-gray-900': status === 'terminated',
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
        },
        changePreferredNumberOfRows: (state, payload) => {
            state.preferredNumberOfRows = payload;
        }
    }
});