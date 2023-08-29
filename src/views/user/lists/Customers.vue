<template>
    <WMListSubHeader :activeButtons="isAnyRowSelected" :filterLabels="filterLabels" :defaultOption="filterLabels[1]"
                     entity="customer" @new="displayNewForm">
    </WMListSubHeader>
    <Sidebar v-model:visible="isDetailsVisible" class="details-sidebar w-6">
        <h2>{{ customerDetailRow.name }}</h2>
        <Divider />

        <WMContactsTable :contacts="contacts" :columns="contactColumns" :showControls="false" :rows="5">
        </WMContactsTable>

    </Sidebar>
    <Sidebar v-model:visible="isNewFormVisible" class="new-sidebar w-6"
             :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''" :position="layoutConfig.isRTL.value ? 'left' : 'right'">
        <h2>לקוח חדש</h2>

        <WMNewCustomerForm> </WMNewCustomerForm>

    </Sidebar>
    <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable v-model:selection="selectedCustomers" :value="customers" dataKey="id" tableStyle="min-width: 50rem"
                   class="p-datatable-sm" scrollable scrollHeight="flex" paginator :rows="15">
            <Column style="width: 35px">
                <template #body="slotProps">
                    <img @click="displayDetails(slotProps.data)" src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>

            <Column field="telephone" header="מס’ לקוח">
                <template #body="slotProps">
                    <router-link :to="{ name: 'customerDetail', params: { 'id': slotProps.data.id } }"
                                 class="vertical-align-middle">{{ slotProps.data.id }}</router-link>
                </template>
            </Column>

            <Column field="name" header="שם לקוח"></Column>
            <Column field="type" header="סוג"></Column>
            <Column field="selected_product" header="איש קשר ראשי">
                <template #body="slotProps">
                    <router-link :to="{ name: 'contactDetail', params: { 'id': slotProps.data.contact_id } }"
                                 class="vertical-align-middle">{{ slotProps.data.contact }}</router-link> </template>
            </Column>
            <Column field="status" header="סטטוס"></Column>
            <Column field="address" header="כתובת"></Column>
            <Column field="open_processes" header="תהליכים פתוחים" class="numeric"></Column>
            <Column field="open_tasks" header="תהליכים בחריגה" class="numeric"></Column>
            <Column field="exception_tasks" header="משימות פתוחות" class="numeric"></Column>
            <Column field="rating" header="משימות בחריגה"></Column>
            <Column field="domain" header="דירוג"></Column>
            <Column field="status" header="תחום"></Column>
            <Column field="id" header="מזהה"></Column>
            <Column field="owner" header="אחראי"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { CustomerService } from '@/service/CustomerService';
import { ContactsService } from '@/service/ContactsService';
import { ServicesService } from '@/service/ServicesService';
import { TasksService } from '@/service/TasksService';
import { useListUtilsStore } from '@/stores/listUtils';
import WMListSubHeader from '@/components/layout/WMListSubHeader.vue';
import WMContactsTable from '@/components/tables/WMContactsTable.vue';
import WMNewCustomerForm from '@/components/forms/WMCustomerForm.vue';
import { useLayout } from '@/layout/composables/layout';

onMounted(() => {
    CustomerService.getCustomers().then((data) => (customers.value = data));
    ContactsService.getContactsMini().then((data) => (contacts.value = data));
    ServicesService.getServicesMini().then((data) => (services.value = data));
    TasksService.getTasksMini().then((data) => (tasks.value = data));
});

const customers = ref();
const contacts = ref();
const services = ref();
const tasks = ref();
const selectedCustomers = ref([]);
const listUtilsStore = useListUtilsStore();
const contactColumns = ref(listUtilsStore.getContactDetailColumns);
const { layoutConfig } = useLayout();

const isAnyRowSelected = computed(() => {
    return selectedCustomers?.value.length > 0;
});

const metaKey = ref(true);

const value = ref(null);
const options = ref([
    { name: 'כל אנשי הקשר', value: 2 },
    { name: 'אנשי הקשר שלי', value: 1 },
]);

const searchValue = ref('');

const menuItems = [
    { label: 'Whatsapp', value: 'option1' },
    { label: 'SMS', value: 'option2' },
]

const filterLabels = [
    { name: 'כל הלקוחות', value: 2 },
    { name: 'הלקוחות שלי', value: 1 },
]

const visible = ref(false);
const customerDetailRow = ref(null);

const isDetailsVisible = ref(false);
const displayDetails = (data) => {
    console.log(data);
    isDetailsVisible.value = true;
    customerDetailRow.value = data;
}

const isNewFormVisible = ref(false);
const displayNewForm = () => {
    isNewFormVisible.value = true;
}


</script>

<style scoped lang="scss"></style>