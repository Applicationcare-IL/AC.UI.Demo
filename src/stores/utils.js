import { defineStore } from 'pinia';

export const useUtilsStore = defineStore('utils', {
    id: 'debounce',
    state: () => ({
        selectedElements: {},
        debounceTimer: null,
        entity: '',
        dateFormat: 'DD/MM/YY'
    }),
    actions: {

        debounceAction(callback, delay = 500) {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer)
            }

            this.debounceTimer = setTimeout(() => {
                callback()
            }, delay)
        },
        cancelDebounce() {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer)
                this.debounceTimer = null
            }
        },
        //Style related Actions
        getStatusConditionalStyle: (status) => {
            return [
                'font-bold',
                {
                    'text-green-900 bg-green-200': status == 'Active',
                    'text-grey-900 bg-grey-200': status != 'Active',

                }
            ];
        },

        resetElements() {
            this.selectedElements = {};
        }
    }
});