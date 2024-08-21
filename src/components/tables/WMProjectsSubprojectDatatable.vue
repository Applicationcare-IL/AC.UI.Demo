<template>
  <DataTable
    v-model:expandedRows="expandedRows"
    v-model:selection="modelValue"
    :value="project"
    :row-class="showExpander"
    class="subtable"
    data-key="project_id"
    table-style="width: 100%; table-layout: fixed;
    border-collapse: collapse;"
  >
    <Column expander style="width: 0px"> </Column>
    <Column style="width: 0px; text-align: center" selection-mode="multiple"></Column>
    <Column
      field="project_number"
      :header="$t('project.project_number')"
      class="link-col"
      style="width: 30px"
    >
      <template #body="slotProps">
        <router-link
          :to="{
            name: 'projectDetail',
            params: { id: slotProps.data.project_id },
          }"
          class="vertical-align-middle"
        >
          {{ slotProps.data.project_id }}
        </router-link>
      </template>
    </Column>

    <Column field="project_name" :header="$t('project.project_name')" style="width: 60px">
      <template #body="slotProps">
        <div class="overflow-x-auto">
          {{ slotProps.data.project_name }}
        </div>
      </template>
    </Column>

    <Column field="city_data" :header="$t('project.city_data')" style="width: 30px">
      <template #body="slotProps">
        <div class="overflow-x-auto">
          <template v-if="slotProps.data.location">
            {{ formatCityData(slotProps.data.location) }}
          </template>
        </div>
      </template>
    </Column>

    <Column field="address" :header="$t('project.address')" style="width: 30px">
      <template #body="slotProps">
        <div class="overflow-x-auto">
          <template v-if="slotProps.data.location">
            {{ formatAddress(slotProps.data.location) }}
          </template>
        </div>
      </template>
    </Column>
    <Column field="project_type" :header="$t('project.project_type')" style="width: 30px">
      <template #body="slotProps">
        <WMOptionSetValue :option-set="slotProps.data.project_type" />
      </template>
    </Column>
    <Column field="project_area" :header="$t('project.project_area')" style="width: 30px">
      <template #body="slotProps">
        <WMOptionSetValue :option-set="slotProps.data.project_area" />
      </template>
    </Column>
    <Column field="project_detail" :header="$t('project.project_detail')" style="width: 30px">
      <template #body="slotProps">
        <WMOptionSetValue :option-set="slotProps.data.project_detail" />
      </template>
    </Column>
    <Column
      field="open_tasks"
      :header="$t('project.open_tasks')"
      class="numeric"
      style="width: 30px"
    >
      <div :class="highlightCellClass(slotProps.data.open_tasks)">
        {{ slotProps.data.open_tasks }}
      </div>
    </Column>
    <Column
      field="breached_tasks"
      :header="$t('project.breached_tasks')"
      class="numeric"
      style="width: 30px"
    >
      <template #body="slotProps">
        <div :class="highlightCellClass(slotProps.data.breached_tasks)">
          {{ slotProps.data.breached_tasks }}
        </div>
      </template>
    </Column>
    <Column field="stage" :header="$t('project.stage')" style="width: 30px" />

    <Column field="status" :header="$t('project.status')" class="p-0 filled-td" style="width: 20px">
      <template #body="slotProps">
        <div :class="statusClass(slotProps.data.state.value)" class="status-label h-full w-full">
          <WMOptionSetValue :option-set="slotProps.data.state" />
        </div>
      </template>
    </Column>

    <Column style="width: 20px" field="state" class="filled-td" :header="$t('state.state')">
      <template #body="slotProps">
        <WMStateField :state="slotProps.data.state" />
      </template>
    </Column>

    <template #expansion="slotProps">
      <WMProjectsSubprojectDatatable v-model="modelValue" :project="slotProps.data.subprojects" />
    </template>
  </DataTable>
</template>

<script setup>
import { ref } from "vue";

const { formatAddress, formatCityData } = useUtils();
const { getStatusConditionalStyle } = useListUtils();

const expandedRows = ref([]);

defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const modelValue = defineModel();

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

function showExpander(data) {
  return data.subprojects && data.subprojects.length ? "" : "no-expander";
}
</script>

<style scoped lang="scss">
:deep(.no-expander .p-row-toggler) {
  opacity: 0;
  pointer-events: none;
}

:deep(td) {
  overflow-x: scroll;
}
</style>
