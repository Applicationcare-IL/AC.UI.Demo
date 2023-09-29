<template>
    <WMListSubHeader :filterLabels="filterLabels" :defaultOption="filterLabels[1]"
                      entity="customer" @new="displayNewForm">
    </WMListSubHeader>
    <Sidebar v-model:visible="isDetailsVisible" class="details-sidebar w-6" :showCloseIcon="false">
        <h2>{{ customerDetail.name }}</h2>
        <Divider />
        <WMContactsTable :customer="customerDetail" :columns="contactColumns" :showControls="false" :rows="5" />
    </Sidebar>
    <WMNewEntitySidebar name="newCustomer" entity="customer"/>
    <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable lazy v-model:selection="selectedCustomers" :value="customers" dataKey="id" tableStyle="min-width: 50rem"
                   class="p-datatable-sm" scrollable scrollHeight="flex" paginator :rows="rows" :first="0" ref="dt"
                   :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                   @update:selection="onSelectionChanged">
            <Column style="width: 35px">
                <template #body="slotProps">
                    <img @click="displayDetails(slotProps.data)" src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>

             <Column field="id" header="מס’ לקוח" class="link-col">
                <template #body="slotProps">
                    <router-link :to="{ name: 'customerDetail', params: { 'id': slotProps.data.id } }"
                                 class="vertical-align-middle">{{ slotProps.data.id }}</router-link>

                </template>
            </Column>

            <Column field="name" header="שם לקוח"></Column>
            <Column field="type" header="סוג">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.type)">
                        {{ $t('option-set.customer_type.' + slotProps.data.type.value) }}
                    </div>
                </template>
            </Column>
            <Column field="main_contact" header="איש קשר ראשי" class="link-col">
                <template #body="slotProps">
                    <router-link v-if="slotProps.data.main_contact.id != null" :to="{ name: 'contactDetail', params: { 'id': slotProps.data.main_contact.id } }"
                                 class="vertical-align-middle">{{ slotProps.data.main_contact.name }}</router-link>
                </template>
            </Column>
            <Column field="status" header="סטטוס">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.status)">
                        {{ $t('statuses.' + slotProps.data.status.value.toLowerCase()) }}
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
                        {{ slotProps.data.rating ? $t('customer-rating.' + slotProps.data.rating.value) : '' }}
                    </div>
                </template>
            </Column>
            <Column field="service_areas" header="תחום">
                <template #body="slotProps">
                    <div :class="highlightCellClass(slotProps.data.area)" class="flex flex-row gap-2">
                        <Chip v-for="area in slotProps.data.service_areas" :label="area.value"></Chip>
                    </div>
                </template>
            </Column>
            <Column field="number" header="מזהה"></Column>
            <Column field="owner.type" header="אחראי"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
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
import { useUtilsStore } from '@/stores/utils';
import WMNewEntitySidebar from '@/components/layout/WMNewEntitySidebar.vue';

onMounted(() => {
    loading.value = true;
    utilsStore.entity="customer"

    loadLazyData();

    ServicesService.getServicesMini().then((data) => (services.value = data));
    TasksService.getTasksMini().then((data) => (tasks.value = data));
});

const dt = ref();
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

const loadLazyData = () => {
    loading.value = true;

    CustomerService.getCustomersFromApi({ page: lazyParams.value.page + 1, per_page: listUtilsStore.rows }).then((result) => {
        console.log(result);
        customers.value = result.data;
        totalRecords.value = result.totalRecords;
        loading.value = false;
    });
};

const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData();
};

const customers = ref();
const services = ref();
const tasks = ref();
const selectedCustomers = ref([]);
const listUtilsStore = useListUtilsStore();
const contactColumns = ref(listUtilsStore.getContactDetailColumns);

const filterLabels = [
    { name: 'כל הלקוחות', value: 2 },
    { name: 'הלקוחות שלי', value: 1 },
]

const customerDetail = ref(null);

const isDetailsVisible = ref(false);
const displayDetails = (data) => {
    customerDetail.value = data;
    isDetailsVisible.value = true;
}

const displayNewForm = () => {
    formUtilsStore.expandSidebar = 'newCustomer';
}

const highlightCellClass = (data) => {
    return [{ 'bg-red-100 text-red-600': data > 0 }];
};

utilsStore.resetElements();
const onSelectionChanged = () => {
    utilsStore.selectedElements['customer'] = selectedCustomers.value;
};

const rows = computed(() => {
    return listUtilsStore.rows;
});

watch(() => listUtilsStore.rows, () => {
    loadLazyData();
});

</script>

<style scoped lang="scss"></style>