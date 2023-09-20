<template>
    <WMListSubHeader :activeButtons="isAnyRowSelected" :filterLabels="filterLabels" :defaultOption="filterLabels[1]"
                     entity="customer" @new="displayNewForm">
    </WMListSubHeader>
    <Sidebar v-model:visible="isDetailsVisible" class="details-sidebar w-6" :showCloseIcon="false">
        <h2>{{ customerDetailRow.name }}</h2>
        <Divider />
        <WMContactsTable :contacts="contacts" :columns="contactColumns" :showControls="false" :rows="5">
        </WMContactsTable>
    </Sidebar>
    <Sidebar v-model:visible="formUtilsStore.isSidebarExpanded" class="new-sidebar w-6" :showCloseIcon="false"
             :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''" :position="layoutConfig.isRTL.value ? 'left' : 'right'">
        <div class="flex flex-row justify-content-between align-content-center">
            <h1 class="h1 mb-0">{{ $t('new', ['customer.customer']) }}</h1>
            <router-link :to="{ name: 'newCustomer' }" class="p-2">
                <img src="@/assets/icons/fullScreen.svg" alt="fullScreen" />
            </router-link>
        </div>
        <Divider />
        <WMNewCustomerForm></WMNewCustomerForm>
        <WMFormButtons></WMFormButtons>
    </Sidebar>
    <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable lazy v-model:selection="selectedCustomers" :value="customers" dataKey="id" tableStyle="min-width: 50rem"
                   class="p-datatable-sm" scrollable scrollHeight="flex" paginator :rows="15" :first="0" ref="dt"
                   :totalRecords="totalRecords" :loading="loading" @page="onPage($event)">
            <Column style="width: 35px">
                <template #body="slotProps">
                    <img @click="displayDetails(slotProps.data)" src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>

            <Column field="id" header="מס’ לקוח">
                <template #body="slotProps">
                    <router-link :to="{ name: 'customerDetail', params: { 'id': slotProps.data.id } }"
                                 class="vertical-align-middle">{{ slotProps.data.id }}</router-link>
                </template>
            </Column>

            <Column field="name" header="שם לקוח"></Column>
            <Column field="type" header="סוג">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.type)">
                        {{ $t(slotProps.data.type) }}
                    </div>
                </template>
            </Column>
            <Column field="selected_product" header="איש קשר ראשי">
                <template #body="slotProps">
                    <router-link :to="{ name: 'contactDetail', params: { 'id': slotProps.data.contact_id } }"
                                 class="vertical-align-middle">{{ slotProps.data.contact }}</router-link> </template>
            </Column>
            <Column field="status" header="סטטוס">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.status)">
                        {{ $t('statuses.' + slotProps.data.status.toLowerCase()) }}
                    </div>
                </template>
            </Column>
            <Column field="address" header="כתובת"></Column>
            <Column field="open_services" header="תהליכים פתוחים" class="numeric"></Column>
            <Column field="breached_services" header="תהליכים בחריגה" class="numeric">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.breached_services)">
                        {{ slotProps.data.breached_services }}
                    </div>
                </template>
            </Column>
            <Column field="open_tasks" header="תהליכים בחריגה" class="numeric"></Column>
            <Column field="breached_tasks" header="משימות בחריגה" class="numeric">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.breached_tasks)">
                        {{ slotProps.data.breached_tasks }}
                    </div>
                </template>
            </Column>
            <Column field="rating" header="דירוג">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.rating)">
                        {{ slotProps.data.rating ? $t('customer-rating.' + slotProps.data.rating) : '' }}
                    </div>
                </template>
            </Column>
            <Column field="area" header="תחום">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.area)">
                        {{ slotProps.data.area ? $t('area.' + slotProps.data.area) : '' }}
                    </div>
                </template>
            </Column>
            <Column field="number" header="מזהה"></Column>
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
import WMFormButtons from '@/components/layout/WMFormButtons.vue';
import WMContactsTable from '@/components/tables/WMContactsTable.vue';
import WMNewCustomerForm from '@/components/forms/WMNewCustomerForm.vue';
import { useLayout } from '@/layout/composables/layout';
import { useFormUtilsStore } from '@/stores/formUtils';

onMounted(() => {
    loading.value = true;

    loadLazyData();

    ContactsService.getContactsMini().then((data) => (contacts.value = data));
    ServicesService.getServicesMini().then((data) => (services.value = data));
    TasksService.getTasksMini().then((data) => (tasks.value = data));
});

const dt = ref();
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});
const formUtilsStore = useFormUtilsStore();

const loadLazyData = () => {
    loading.value = true;

    CustomerService.getCustomersFromApi({ page: lazyParams.value.page + 1 }).then((result) => {
        console.log(result);
        customers.value = result.data;
        totalRecords.value = result.totalRecords;
        loading.value = false;
    });
};

const onPage = (event) => {
    lazyParams.value = event;
    console.log(lazyParams)
    loadLazyData();
};

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
    formUtilsStore.isSidebar = true;
    formUtilsStore.isSidebarExpanded = true;
}

const highlightCellClass = (data) => {
    return [{ 'bg-red-100 text-red-600': data > 0 }];
};

</script>

<style scoped lang="scss"></style>