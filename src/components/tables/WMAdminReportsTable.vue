<template>
  <!-- <pre>{{ reports }}</pre> -->
  <DataTable
    lazy
    :value="reports"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
  >
    <Column
      v-for="column in columns"
      :key="column.name"
      :field="column.name"
      :header="$t(column.header)"
      :class="column.class"
      :style="column.width ? { width: column.width } : {}"
    >
      <template #body="{ data }">
        <WMRenderTableFieldBody v-model="data[column.field]" :column-data="column" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
// IMPORTS
import { ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getReports } = useAdminReports();

// INJECT

// PROPS, EMITS

// REFS
const totalRecords = ref(0);
const reports = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminReportDetail",
  },
  {
    name: "name",
    type: "text",
    field: "name",
    header: "name",
  },
  {
    name: "description",
    type: "text",
    field: "description",
    header: "description",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  console.log("loadLazyData");
  const filters = utilsStore.filters["admin-reports"];
  const nextPage = lazyParams.value.page + 1;
  const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  if (searchValueParam) {
    params.append("search", searchValueParam);
  }

  let response = await getReports(params);
  reports.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

// const onPage = (event) => {
//   console.log(event);
// };

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
  () => utilsStore.searchString["employee"],
  () => {
    searchValue.value = utilsStore.searchString["employee"];
    utilsStore.debounceAction(() => {
      loadLazyData();
    });
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
