<template>
    <WMListSubHeader :filterLabels="filterLabels" :defaultOption="filterLabels[1]"
                     @new="displayNewForm" entity="service">
    </WMListSubHeader>
    <Sidebar v-model:visible="isDetailsVisible" class="details-sidebar w-6" :showCloseIcon="false"
             :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
        <h2> {{ $t('service.service') }} {{ serviceDetail.service_number }}</h2>
        <Divider />
        <!-- <WMContactsTable :customer="serviceDetail" :columns="serviceColumns" :showControls="false" :rows="5" /> -->
    </Sidebar>
    <WMNewEntitySidebar name="newService" entity="service" />
    <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable v-model:selection="selectedServices" :rowClass="rowClass" :value="services" dataKey="service_number"
                   tableStyle="min-width: 50rem" class="p-datatable-sm" scrollable scrollHeight="flex" paginator :rows="rows"
                   :first="0" ref="dt" :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                   @update:selection="onSelectionChanged">
            <Column style="width: 35px">
                <template #body="slotProps">
                    <img @click="displayDetails(slotProps.data)" src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>
            <Column field="service_number" header="מס’ תהליך" class="link-col">
                <template #body="slotProps">
                    <router-link :to="{ name: 'serviceDetail', params: { 'id': slotProps.data.service_number } }"
                                 class="vertical-align-middle">{{ slotProps.data.service_number }}</router-link>
                </template>
            </Column>
            <Column field="contact" header="איש קשר" class="link-col">
                <template #body="slotProps">
                    <router-link :to="{ name: 'contactDetail', params: { 'id': slotProps.data.contact_id } }"
                                 class="vertical-align-middle">{{ slotProps.data.contact }}</router-link>
                </template>
            </Column>

            <Column field="open_date" header="נפתח"></Column>
            <Column field="due_date" header="תאריך יעד"></Column>
            <Column field="classification_1" header="תחום"></Column>
            <Column field="classification_2" header="תת-תחום"></Column>
            <Column field="classification_3" header="מהות"></Column>
            <Column field="days_from_opening_date" header="משך"></Column>
            <Column field="owner" header="אחראי">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.owner }}</router-link>
                </template>
            </Column>
            <Column field="staff" header="צוות"></Column>
            <Column field="SLA" header="SLA" class="sla">
                <template #body="slotProps">
                    <div :class="slaClass(slotProps.data)">
                        {{ slotProps.data.days_for_closing }} ימים
                    </div>
                </template>
            </Column>
            <Column field="priority" header="עדיפות" class="numeric priority">
                <template #body="slotProps">
                    <div :class="priorityClass(slotProps.data)">
                        {{ slotProps.data.is_active ? slotProps.data.priority : '-' }}
                    </div>
                </template>
            </Column>
            <Column field="recurring" header="חוזר"></Column>
            <Column field="urgency" header="דחיפות"></Column>
            <Column field="last_change" header="שינוי אחרון"></Column>
            <Column field="closed" header="נסגר"></Column>
            <Column field="stage" header="שליחת נציג בטחון"></Column>

        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { ServicesService } from '@/service/ServicesService';
import WMListSubHeader from '@/components/layout/WMListSubHeader.vue';
import { useUtilsStore } from '@/stores/utils';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useListUtilsStore } from '@/stores/listUtils';
import { useLayout } from '@/layout/composables/layout';
import WMNewEntitySidebar from '@/components/layout/WMNewEntitySidebar.vue';

const { layoutConfig } = useLayout();
const formUtilsStore = useFormUtilsStore();
const listUtilsStore = useListUtilsStore();
const utilsStore = useUtilsStore();

const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});

const services = ref();
// const selectedServices = ref([]);
const dt = ref();

onMounted(() => {
    utilsStore.entity = "service"

    loadLazyData();
});

const loadLazyData = () => {
    loading.value = true;
    ServicesService.getServicesFromApi({ page: lazyParams.value.page + 1, per_page: 30 }).then((result) => {
        console.log(result);
        services.value = result.data;
        totalRecords.value = result.totalRecords;
        loading.value = false;
    });
};

const onPage = (event) => {

    lazyParams.value = event;
    loadLazyData();
};

// const isAnyRowSelected = computed(() => {
//     return selectedServices?.value.length > 0;
// });


const isDetailsVisible = ref(false);
const displayNewForm = () => {
    console.log("NEW")
    formUtilsStore.expandSidebar = 'newService';
}

//Display sidebars
const serviceDetail = ref(null);
const displayDetails = (data) => {
    serviceDetail.value = data;
    isDetailsVisible.value = true;
}

const metaKey = ref(true);

const value = ref(null);
const options = ref([
    { name: 'כל אנשי הקשר', value: 2 },
    { name: 'אנשי הקשר שלי', value: 1 },
]);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);


const searchValue = ref('');

const rowClass = (data) => {
    return [{ 'inactive_row': !data.is_active }];
};

const priorityClass = (data) => {
    return [
        'text-blue-600',
        {
            'bg-blue-75': data.priority === 1 && data.is_active,
            'bg-blue-50': data.priority === 2 && data.is_active,
            'bg-blue-25': data.priority === 3 && data.is_active
        }
    ];
};

const slaClass = (data) => {
    return [
        'px-2',
        {
            'bg-teal-200 text-teal-900': data.SLA === 'no_breach',
            'bg-yellow-100 text-gray-900': data.SLA === 'near_breach',
            'bg-red-100 text-red-600 ': data.SLA === 'breach',
            'text-teal-900': data.SLA === 'עמד ביעד',
            'text-red-600': data.SLA === 'הסתיים בחריגה',
        }
    ];
};


const menuItems = [
    { label: 'Whatsapp', value: 'option1' },
    { label: 'SMS', value: 'option2' },
]

const filterLabels = [
    { name: 'כל התהליכים', value: 2 },
    { name: 'התהליכים שלי', value: 1 },
]

//Manage selected rows
const selectedServices = ref([]);
utilsStore.resetElements();
const onSelectionChanged = () => {
    console.log(selectedServices.value)
    utilsStore.selectedElements['service'] = selectedServices.value;
};

//Number of rows per page
const rows = computed(() => {
    return listUtilsStore.rows;
});

watch(() => listUtilsStore.rows, () => {
    loadLazyData();
});

</script>


<style scoped lang="scss"></style>