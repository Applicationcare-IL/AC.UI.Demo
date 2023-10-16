<template>
    <Sidebar v-model:visible="isVisible" class="new-sidebar w-6" :showCloseIcon="false"
             :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''" :position="layoutConfig.isRTL.value ? 'left' : 'right'">
        <div class="flex flex-row justify-content-between align-content-center">
            <h1 class="h1 mb-0">{{ $t('new', [`${entity}.${entity}`]) }}</h1>
            <router-link :to="{ name: props.name }" class="p-2">
                <img src="@/assets/icons/fullScreen.svg" alt="fullScreen" />
            </router-link>
        </div>
        <Divider />
        <WMNewCustomerForm v-if="props.name === 'newCustomer'" :isSidebar="true"></WMNewCustomerForm>
        <WMNewContactForm v-if="props.name === 'newContact'" :isSidebar="true"></WMNewContactForm>
        <WMNewServiceForm v-if="props.name === 'newService'" :isSidebar="true"></WMNewServiceForm>
        <WMNewTaskForm v-if="props.name === 'newTask'" :isSidebar="true"></WMNewTaskForm>
        <WMFormButtons></WMFormButtons>
    </Sidebar>
</template>

<script setup>

import { ref, defineProps, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useFormUtilsStore } from '@/stores/formUtils';
import  WMNewCustomerForm  from '@/components/forms/WMNewCustomerForm.vue';
import  WMNewContactForm  from '@/components/forms/WMNewContactForm.vue';
import  WMNewServiceForm  from '@/components/forms/WMNewServiceForm.vue';
import  WMNewTaskForm  from '@/components/forms/WMNewTaskForm.vue';
import  WMFormButtons  from '@/components/layout/WMFormButtons.vue';

const formUtilsStore = useFormUtilsStore();
const { layoutConfig } = useLayout();

const isVisible = ref();

formUtilsStore.isSidebar = true;

watch(() => formUtilsStore.expandSidebar, (value) => {
    isVisible.value = value == props.name;
});

watch(() => isVisible.value, (value) => {
    if(!value) formUtilsStore.expandSidebar = '';
});

const props = defineProps({
    name: {
        type: String,
        default: '',
    },
    entity: {
        type: String,
        default: '',
    },
});

</script>