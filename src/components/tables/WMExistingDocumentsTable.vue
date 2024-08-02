<template>
  <h2 class="h2">
    {{ $t("documents.select-an-existing-document") }}
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
    scroll-height="400px"
    paginator
    lazy
    :rows="rows"
    :row-class="rowClass"
    :total-records="totalRecords"
    :class="`p-datatable-${tableClass}`"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
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
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getExistingServiceColumns } = useListUtils();
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

const emit = defineEmits(["update:selection"]);

// REFS
const totalRecords = ref(0);
const selectedService = ref();
const rows = ref(20);
const lazyParams = ref({});
const services = ref([]);
const searchValue = ref("");
const columns = ref(getExistingServiceColumns());

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = utilsStore.filters["related-service"];
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

const rowClass = (data) => {
  return [{ inactive_row: !data.is_active }];
};

const priorityClass = (data) => {
  return getPriorityClasses(data);
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedService.value);
};

// PROVIDE, EXPOSE

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["related-service"],
  () => {
    searchValue.value = utilsStore.searchString["related-service"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>
