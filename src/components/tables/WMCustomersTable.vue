<template>
    <h2 class="h2">{{ $t('customer.customers') }}</h2>
    <div class="flex flex-column gap-3 mb-3">
        <div class="flex flex-row justify-content-between">
            <div class="flex flex-row">
                <WMButton class="m-1 col-6" name="new" icon="new" icon-position="right">{{ t('new') }}</WMButton>
                <WMButton class="m-1 col-6" name="customer" icon="customer">{{ t('customer.add') }}</WMButton>
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
    <DataTable v-model:filters="filters" v-model:selection="selectedCustomers" :value="customers" dataKey="id"
               tableStyle="min-width: 50rem" scrollable paginator :rows="rows">
        <Column v-if="columns.includes('eye')" style="width: 35px">
            <template #body="slotProps">
                <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
            </template>
        </Column>
        <Column v-if="columns.includes('selection')" style="width: 40px" selectionMode="multiple"></Column>
        <Column v-if="columns.includes('star')" class="column-star" :header="$t('customer.main')">
            <template #body="slotProps">
                <img src="/icons/star.svg" alt="" class="vertical-align-middle">
            </template>
        </Column>
        <Column v-if="columns.includes('customer_number')" field="customer-number"
                :header="$t('customer.number-abbreviation')">
            <template #body="slotProps">
                <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.id }}</router-link>
            </template>
        </Column>

        <Column v-if="columns.includes('telephone')" field="telephone" header="מס’ לקוח">
            <template #body="slotProps">
                <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.telephone }}</router-link>
            </template>
        </Column>
        <Column v-if="columns.includes('name')" field="name" header="שם לקוח"></Column>
        <Column v-if="columns.includes('type')" field="type" header="סוג"></Column>
        <Column v-if="columns.includes('selected_product')" field="selected_product" header="איש קשר ראשי">
            <template #body="slotProps">
                <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data.selected_product }}</router-link>
            </template>
        </Column>
        <Column v-if="columns.includes('status')" field="status" header="סטטוס"></Column>
        <Column v-if="columns.includes('address')" field="address" header="כתובת"></Column>
        <Column v-if="columns.includes('open_processes')" field="open_processes" header="תהליכים פתוחים" class="numeric">
        </Column>
        <Column v-if="columns.includes('breached_processes')" field="breached_processes" header="תהליכים פתוחים"
                class="numeric">
            <template #body="slotProps">
                <div :class="highlightCellClass(slotProps.data.breached_processes)">
                    {{ slotProps.data.breached_processes }}
                </div>
            </template>
        </Column>
        <Column v-if="columns.includes('open_tasks')" field="open_tasks" header="תהליכים בחריגה" class="numeric"></Column>
        <Column v-if="columns.includes('breached_tasks')" field="breached_tasks" header="משימות פתוחות" class="numeric">
            <template #body="slotProps">
                <div :class="highlightCellClass(slotProps.data.breached_tasks)">
                    {{ slotProps.data.breached_tasks }}
                </div>
            </template>
        </Column>
        <Column v-if="columns.includes('classification1')" field="classification1" :header="$t('customer.classification1')"
                class="buttons">
            <template #body="slotProps">
                <div class="flex flex-row gap-2">
                    <Tag v-for="item in slotProps.data.classification1" class="vertical-align-middle">{{ item }}</Tag>
                </div>
            </template>
        </Column>
        <Column v-if="columns.includes('role')" field="role" :header="$t('role')"></Column>
        <Column v-if="columns.includes('rating')" field="rating" header="משימות בחריגה"></Column>
        <Column v-if="columns.includes('domain')" field="domain" header="דירוג"></Column>
        <Column v-if="columns.includes('status')" field="status" header="תחום"></Column>
        <Column v-if="columns.includes('id')" field="id" header="מזהה"></Column>
        <Column v-if="columns.includes('in_charge')" field="in_charge" header="אחראי"></Column>
        <Column v-if="columns.includes('actions')" :header="$t('actions')" class="buttons">
            <template #body="slotProps">
                <div class="flex flex-row gap-2">
                    <WMButton name="edit" icon="edit" />
                    <WMButton name="unlink" icon="unlink" />
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

const selectedCustomers = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);

const props = defineProps({
    customers: Array,
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
        { name: t('customer.all'), value: 2 },
        { name: t('customer.my'), value: 1 },
    ]
}

const highlightCellClass = (data) => {
    return [{ 'bg-red-100 text-red-600': data > 0 }];
};


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});

</script>