import { defineStore } from 'pinia';

export const useUtilsStore = defineStore('utils', {
    id: 'debounce',
    state: () => ({
        selectedElements: [],
        debounceTimer: null
    }),
    actions: {
        updateSelectedElements(elements) 
        {
            // this.selectedElements = elements;
        },
        debounceAction(callback, delay = 500) {
            // Cancelar el temporizador anterior si existe
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer)
            }

            // Establecer un nuevo temporizador para retrasar la acción
            this.debounceTimer = setTimeout(() => {
                callback()
            }, delay)
        },
        cancelDebounce() {
            // Cancelar el temporizador si está en curso
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
    }
});