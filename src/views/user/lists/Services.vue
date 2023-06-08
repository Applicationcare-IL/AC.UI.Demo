<template>
    <WMListSubHeader :activeButtons="isAnyRowSelected" :filterLabels="filterLabels" :defaultOption="filterLabels[1]" entity="service">
    </WMListSubHeader>
    <div class="table-container mt-5 mx-8 flex-auto overflow-auto">
        <DataTable v-model:selection="selectedCustomers" :rowClass="rowClass" :value="customers" dataKey="service_number"
                   tableStyle="min-width: 50rem"
                   class="p-datatable-sm" scrollable scrollHeight="flex" paginator :rows="15">
            <Column style="width: 35px">
                <template #body="slotProps">
                    <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
                </template>
            </Column>
            <Column style="width: 40px" selectionMode="multiple"></Column>
            <Column field="service_number" header="מס’ תהליך">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.service_number }}</router-link>
                </template>
            </Column>
            <Column field="contact" header="איש קשר">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.contact }}</router-link>
                </template>
            </Column>

            <Column field="open_date" header="נפתח"></Column>
            <Column field="due_date" header="תאריך יעד"></Column>
            <Column field="classification_1" header="תחום"></Column>
            <Column field="classification_2" header="תת-תחום"></Column>
            <Column field="classification_3" header="מהות תהליך"></Column>
            <Column field="duration" header="משך"></Column>
            <Column field="in_charge" header="אחראי">
                <template #body="slotProps">
                    <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.in_charge }}</router-link>
                </template>
            </Column>
            <Column field="staff" header="צוות"></Column>
            <Column field="SLA" header="SLA" class="sla">
                <template #body="slotProps">
                    <div :class="slaClass(slotProps.data)">
                        {{ slotProps.data.SLA }}
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
            <Column field="recurrent" header="חוזר"></Column>
            <Column field="urgent" header="שינוי אחרון"></Column>
            <Column field="closed" header="נסגר"></Column>
            <Column field="stage" header="שליחת נציג בטחון"></Column>

        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ServicesService } from '@/service/ServicesService';
import WMListSubHeader from '@/components/layout/WMListSubHeader.vue';

onMounted(() => {
    ServicesService.getServices().then((data) => (customers.value = data));
});

const customers = ref();
const selectedCustomers = ref([]);

const isAnyRowSelected = computed(() => {
    return selectedCustomers?.value.length > 0;
});

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
    console.log(data.is_active);
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

        {
            'bg-teal-200 text-teal-900': data.SLA === '10 ימים',
            'bg-yellow-100 text-gray-900': data.SLA === '2 ימים',
            'bg-red-100 text-red-600 ': data.SLA === '3 ימים',
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

</script>


<style scoped lang="scss"></style>