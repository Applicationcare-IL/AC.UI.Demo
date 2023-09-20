<template>
    <WMNewFormSubHeader></WMNewFormSubHeader>
    <WMNewCustomerForm></WMNewCustomerForm>
</template>

<script setup>
import WMNewCustomerForm from '@/components/forms/WMNewCustomerForm.vue';
import WMNewFormSubHeader from '@/components/layout/WMNewFormSubHeader.vue';
import { useFormUtilsStore } from '@/stores/formUtils';

const formUtilsStore = useFormUtilsStore();

formUtilsStore.isSidebar = false;
formUtilsStore.isSidebarExpanded = false;
</script>