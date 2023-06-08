<template>
    <h2 class="h2">{{ $t('service.services') }}</h2>
    <div class="flex flex-column gap-3 mb-3">
        <div class="flex flex-row justify-content-between">
            <div class="flex flex-row">
                <WMButton class="m-1 col-6" name="new" icon="new" icon-position="right">{{ t('new') }}</WMButton>
                <WMButton class="m-1 col-6" name="assign-white" icon="assign">{{ t('service.assign') }}</WMButton>
                <WMButton class="m-1 col-6" name="export-white" icon="export">ייצוא נתונים</WMButton>
                <Divider layout="vertical" />
                <WMButtonMenu class="m-1" mode="light" :menuItems="menuItems">הודעה</WMButtonMenu>
                <WMButton class="m-1 col-6" name="phone-white" icon="phone">הקצה</WMButton>
                <WMButton class="m-1 col-6" name="mail-white" icon="mail">הקצה</WMButton>
            </div>
            <div class="flex flex-row align-items-center gap-3">
                <WMButton name="filter" icon="filter" :open="isFilterOpen" :applied="isFilterApplied">{{ t('filter') }}
                </WMButton>
                <SelectButton v-model="selectedOption" :options="options" optionLabel="name" class="flex flex-nowrap" />
            </div>
        </div>
        <div>
            <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText class="w-30rem" v-model="filters['global'].value" :placeholder="$t('search')" />
            </span>
        </div>
    </div>
    <DataTable v-model:filters="filters" v-model:selection="selectedServices" :rowClass="rowClass" :value="services" dataKey="id"
               tableStyle="min-width: 50rem" scrollable paginator :rows="rows">
        <Column v-if="columns.includes('eye')" style="width: 35px">
            <template #body="slotProps">
                <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
            </template>
        </Column>
        <Column v-if="columns.includes('selection')" style="width: 40px" selectionMode="multiple"></Column>
        <Column v-if="columns.includes('service_number')" field="service_number" header="מס’ תהליך">
            <template #body="slotProps">
                <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.service_number }}</router-link>
            </template>
        </Column>
        <Column  v-if="columns.includes('contact')" field="contact" header="איש קשר">
            <template #body="slotProps">
                <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.contact }}</router-link>
            </template>
        </Column>

        <Column  v-if="columns.includes('open_date')" field="open_date" header="נפתח"></Column>
        <Column v-if="columns.includes('due_date')" field="due_date" header="תאריך יעד"></Column>
        <Column v-if="columns.includes('classification_1')" field="classification_1" header="תחום"></Column>
        <Column v-if="columns.includes('classification_2')" field="classification_2" header="תת-תחום"></Column>
        <Column v-if="columns.includes('classification_3')" field="classification_3" header="מהות תהליך"></Column>
        <Column v-if="columns.includes('duration')" field="duration" header="משך"></Column>
        <Column v-if="columns.includes('in_charge')" field="in_charge" header="אחראי">
            <template #body="slotProps">
                <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.in_charge }}</router-link>
            </template>
        </Column>
        <Column v-if="columns.includes('team')" field="team" header="צוות"></Column>
        <Column v-if="columns.includes('staff')" field="staff" header="צוות"></Column>
        <Column v-if="columns.includes('SLA')" field="SLA" header="SLA" class="sla">
            <template #body="slotProps">
                <div :class="slaClass(slotProps.data)">
                    {{ slotProps.data.SLA }}
                </div>
            </template>
        </Column>
        <Column  v-if="columns.includes('priority')" field="priority" header="עדיפות" class="numeric priority">
            <template #body="slotProps">
                <div :class="priorityClass(slotProps.data)">
                    {{ slotProps.data.is_active ? slotProps.data.priority : '-' }}
                </div>
            </template>
        </Column>
        <Column  v-if="columns.includes('recurrent')" field="recurrent" header="חוזר"></Column>
        <Column  v-if="columns.includes('last_change')" field="last_change" header="שינוי אחרון"></Column>
        <Column  v-if="columns.includes('urgent')" field="urgent" header="שינוי אחרון"></Column>
        <Column  v-if="columns.includes('closed')" field="closed" header="נסגר"></Column>
        <Column  v-if="columns.includes('stage')" field="stage" header="שליחת נציג בטחון"></Column>
    </DataTable>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { FilterMatchMode } from 'primevue/api'

const { t, locale } = useI18n();

const selectedServices = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);

const props = defineProps({
    services: Array,
    rows: {
        type: Number,
        default: 5
    },
    columns: {
        type: Array,
        default: ['eye', 'name', 'telephone', 'type', 'selected_product', 'status', 'address', 'open_processes', 'open_tasks', 'exception_tasks', 'rating', 'domain', 'status', 'id', 'in_charge']
    }
});

watch(locale, () => {
    options.value = getSelectButtonValues();
});


const options = ref(getSelectButtonValues());

function getSelectButtonValues() {
    return [
        { name: t('all-entities',  {label: 'service.services'}), value: 2 },
        { name: t('my-entities', {label: 'service.services'}), value: 1 },
    ]
}

const highlightCellClass = (data) => {
    return [{ 'bg-red-100 text-red-600': data > 0 }];
};

const rowClass = (data) => {
    return [{ 'inactive_row': !data.is_active }];
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

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const menuItems = [
    { label: 'Whatsapp', value: 'option1' },
    { label: 'SMS', value: 'option2' },
]

</script>