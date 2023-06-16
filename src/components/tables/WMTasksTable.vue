<template>
    <h2 class="h2">{{ $t('task.tasks') }}</h2>
    <div class="flex flex-column gap-3 mb-3">
        <div class="flex flex-row justify-content-between">
            <div class="flex flex-row">
                <WMButton class="m-1 col-6" name="new" icon="new" icon-position="right">{{ t('new') }}</WMButton>
                <WMButton class="m-1 col-6" name="assign-white" icon="assign">{{ t('service.assign') }}</WMButton>
                <WMButton class="m-1 col-6" name="done-white" icon="done">{{ t('service.assign') }}</WMButton>
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
    <DataTable v-model:filters="filters" v-model:selection="selectedTasks" :rowClass="rowClass" :value="tasks"
               dataKey="task_number" tableStyle="min-width: 50rem" scrollable paginator :rows="rows">
        <Column v-if="multiselect" style="width: 40px" selectionMode="multiple"></Column>
        <Column v-for="column in columns" :key="column.name" :field="column.name"
                :header="column.header ? $t(column.header) : $t(`task.${column.name}`)" :class="column.class">
            <template v-if="column.type === 'link'" #body="slotProps">
                <router-link to="/foo" class="vertical-align-middle">{{ slotProps.data[column.name] }}</router-link>
            </template>
            <template v-if="column.type === 'detail'">
                <img src="/icons/eye.svg" alt="" class="vertical-align-middle">
            </template>
            <template v-if="column.type === 'sla'" #body="slotProps">
                <div :class="slaClass(slotProps.data)">
                    {{ slotProps.data.SLA }}
                </div>
            </template>
        </Column>
    </DataTable>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { FilterMatchMode } from 'primevue/api'
import { useListUtilsStore } from '@/stores/listUtils';

const { t, locale } = useI18n();

const selectedTasks = ref(null);
const isFilterOpen = ref(false);
const isFilterApplied = ref(false);
const selectedOption = ref(1);
const listUtilsStore = useListUtilsStore();

const props = defineProps({
    tasks: Array,
    rows: {
        type: Number,
        default: 5
    },
    columns: {
        type: Array,
        required: true
    },
    multiselect: {
        type: Boolean,
        default: true
    }
});

const options = ref();
options.value = listUtilsStore.getSelectFilterButtonValues('task.tasks');

watch(locale, () => {
    options.value = listUtilsStore.getSelectFilterButtonValues('task.tasks');
});

const rowClass = (data) => {
    return [{ 'inactive_row': !data.is_open }];
};

const slaClass = (data) => {
    return listUtilsStore.getSlaConditionalStyle(data);
}

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});

</script>