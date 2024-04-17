<template>
  <h2 v-if="!hideTitle" class="h2">
    {{ $t("service.select-an-aexisting-service") }}
  </h2>
  <div class="flex flex-column gap-3 mb-3">
    <div class="flex flex-row gap-3">
      <WMSearchBox entity="related-service" />
    </div>
  </div>

  <DataTable
    v-model:selection="selectedService"
    :value="services"
    selection-mode="single"
    data-key="service_number"
    table-style="min-width: 50rem"
    scrollable
    paginator
    lazy
    :rows="rows"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
  >
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="column.header ? $t(column.header) : $t(`service.${column.name}`)"
      :class="column.class"
    >
      <template #body="slotProps">
        <template v-if="column.type === 'text'">
          {{ slotProps.data[column.name] }}
        </template>
        <template v-if="column.type === 'detail'">
          <img src="/icons/eye.svg" alt="" class="vertical-align-middle" />
        </template>
        <template v-if="column.type === 'link'">
          <router-link
            :to="{
              name: 'serviceDetail',
              params: { id: slotProps.data.service_number },
            }"
            class="vertical-align-middle"
            >{{ slotProps.data.service_number }}</router-link
          >
        </template>
        <template v-if="column.type === 'sla'">
          <WMSLATag
            v-if="slotProps.data.sla"
            :sla="slotProps.data.sla"
            :days-for-closing="slotProps.data.days_for_closing"
            :state="slotProps.data.state.value"
          >
          </WMSLATag>
        </template>
        <template v-if="column.type === 'priority'">
          <div :class="priorityClass(slotProps.data)">
            {{ slotProps.data.is_active ? slotProps.data.priority : "-" }}
          </div>
        </template>
        <template v-if="column.type === 'translate'">
          {{ $t(slotProps.data[column.name]) }}
        </template>
        <template v-if="column.type === 'optionset'">
          <WMOptionSetValue :option-set="slotProps.data[column.name]" />
        </template>
      </template>
    </Column>
  </DataTable>
  <pre>{{ services }}</pre>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getRelatedServiceColumns } = useListUtils();
const { getServicesFromApi } = useServices();

const utilsStore = useUtilsStore();
const { getPriorityClasses } = useListUtils();

// INJECT

// PROPS, EMITS
defineProps({
  hideTitle: {
    type: Boolean,
    default: false,
  },
});

// REFS
const totalRecords = ref(0);
const selectedService = ref();
const rows = ref(10);
const lazyParams = ref({});
const services = ref([]);
const searchValue = ref("");
const columns = ref(getRelatedServiceColumns());

// COMPUTED

// COMPONENT METHODS
const loadLazyData = async () => {
  const filters = utilsStore.filters["related-services"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;
  const selectedRowsPerPageParam = rows.value;

  // Create a new URLSearchParams object by combining base filters and additional parameters
  const params = new URLSearchParams({
    ...filters,
    page: nextPage,
    per_page: selectedRowsPerPageParam,
    search: searchValueParam,
  });

  getServicesFromApi(params).then((result) => {
    services.value = result.data;
    totalRecords.value = result.totalRecords;
  });
};

const priorityClass = (data) => {
  return getPriorityClasses(data);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
