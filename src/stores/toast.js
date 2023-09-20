import { useToast as useToastPrime } from 'primevue/usetoast';

export function useToast(){
    const toast = useToastPrime();
    const success = (message) => {
        toast.add({severity:'success', summary: 'Success', detail: message, life: 3000});
    }

    const info = (message) => {
        toast.add({severity:'info', summary: 'Info', detail: message, life: 3000});
    }

    const warning = (message) => {
        toast.add({severity:'warn', summary: 'Warn', detail: message, life: 3000});
    }

    const error = (message) => {
        toast.add({severity:'error', summary: 'Error', detail: message, life: 3000});
    }

    return { success, info, warning, error }

}