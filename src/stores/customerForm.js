import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCustomerFormStore = defineStore('customerStore', () => {

    //This store allows other components to access the submit function
    const submit = ref('');

    return { submit }

});