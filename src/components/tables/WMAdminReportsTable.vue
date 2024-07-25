<template>
  <!-- <pre>{{ reports }}</pre> -->
  <DataTable
    v-model:selection="selectedReports"
    lazy
    :value="reports"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <!-- <Column style="width: 40px" selection-mode="multiple" /> -->
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
const emit = defineEmits(["update:selection"]);

// REFS
const selectedReports = ref([]);
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
  // {
  //   name: "manager",
  //   type: "text",
  //   field: "manager_fullname",
  //   header: "manager",
  // },
  // {
  //   name: "phone",
  //   type: "text",
  //   field: "phone",
  //   header: "mobilephone",
  // },
  // {
  //   name: "email",
  //   type: "text",
  //   field: "email",
  //   header: "email",
  // },
  // {
  //   name: "active",
  //   type: "state",
  //   field: "active",
  //   header: "state.state",
  //   width: "100px",
  //   class: "p-0 filled-td",
  // },
  // {
  //   name: "roles",
  //   type: "chips",
  //   field: "roles",
  //   header: "roles",
  // },
  // {
  //   name: "teams",
  //   type: "chips",
  //   field: "teams",
  //   header: "teams",
  // },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
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

const onSelectionChanged = () => {
  emit("update:selection", selectedReports.value);
};

const cleanSelectedReports = () => {
  selectedReports.value = [];
  onSelectionChanged();
};

// const onPage = (event) => {
//   console.log(event);
// };

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedReports,
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
