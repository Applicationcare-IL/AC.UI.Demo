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
    <DataTable v-model:filters="filters" v-model:selection="selectedServices" :rowClass="rowClass" :value="services"
               dataKey="service_number" tableStyle="min-width: 50rem" scrollable paginator :rows="rows">
        <Column v-if="multiselect" style="width: 40px" selectionMode="multiple"></Column>
        <Column v-for="column in columns" :key="column.name" :field="column.name"
                :header="column.header ? $t(column.header) : $t(`service.${column.name}`)" :class="column.class">
            <template v-if="column.type === 'detail'" #body="slotProps">
                <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
            </template>
            <template v-if="column.type === 'link'" #body="slotProps">
                <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.service_number }}</router-link>
            </template>
            <template v-if="column.type === 'sla'" #body="slotProps">
                <div :class="slaClass(slotProps.data)">
                    {{ slotProps.data.SLA }}
                </div>
            </template>
            <template v-if="column.type === 'priority'" #body="slotProps">
                <div :class="priorityClass(slotProps.data)">
                    {{ slotProps.data.is_active ? slotProps.data.priority : '-' }}
                </div>
            </template>
        </Column>
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
    },
    multiselect: {
        type: Boolean,
        default: false
    }
});

watch(locale, () => {
    options.value = getSelectButtonValues();
});


const options = ref(getSelectButtonValues());

function getSelectButtonValues() {
    return [
        { name: t('all-entities', { label: 'service.services' }), value: 2 },
        { name: t('my-entities', { label: 'service.services' }), value: 1 },
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