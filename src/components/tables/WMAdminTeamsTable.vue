<template>
<!--   <pre>{{ teams }}</pre>-->
  <DataTable
    v-model:selection="selectedTeams"
    lazy
    :value="teams"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <Column style="width: 40px" selection-mode="multiple" />
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
import {ref, watch} from "vue";

import useAdminTeams from "@/composables/useAdminTeams";
import { useUtilsStore } from "@/stores/utils";


// DEPENDENCIES
const { getTeams } = useAdminTeams();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["update:selection"]);

// REFS
const teams = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

const selectedTeams = ref([]);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminTeamDetail",
  },
  {
    name: "name",
    type: "text",
    field: "name",
    header: "team.name",
  },
  {
    name: "manager_name",
    type: "text",
    field: "manager_name",
    header: "manager",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "state.state",
    width: "100px",
    class: "p-0 filled-td",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const nextPage = lazyParams.value.page + 1;

  const params = {
    page: nextPage,
    per_page: 10,
  };

  let response = await getTeams(params);
  teams.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedTeams.value);
};

const cleanSelectedTeams = () => {
  selectedTeams.value = [];
  onSelectionChanged();
};

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedTeams,
});

// WATCHERS
watch(
    () => utilsStore.searchString["team"],
    () => {
      searchValue.value = utilsStore.searchString["team"];
      utilsStore.debounceAction(() => {
        loadLazyData();
      });
    },
    { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
