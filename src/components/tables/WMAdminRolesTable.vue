<template>
  <DataTable
    v-model:selection="selectedRoles"
    lazy
    :value="roles"
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
    <Column style="width: 40px">
      <template #body="{ data }">
        <img
          src="/icons/eye.svg"
          alt=""
          class="vertical-align-middle"
          @click="openSidebar(data.id)"
        />
        <WMRolePreviewSidebar v-model:visible="isPreviewVisible[data.id]" :role="data" />
      </template>
    </Column>
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
import {ref, watch, watchEffect} from "vue";

import useAdminRoles from "@/composables/useAdminRoles";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getRoles } = useAdminRoles();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["update:selection"]);

// REFS
const roles = ref([]);
const totalRecords = ref(0);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

const selectedRoles = ref([]);

const isPreviewVisible = ref([]);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminRoleDetail",
  },
  {
    name: "name",
    type: "text",
    field: "name",
    header: "role.name",
  },
  {
    name: "users",
    type: "text",
    field: "users",
    header: "role.users-in-role",
  },
  {
    name: "active",
    type: "state",
    field: "state",
    header: "State",
    width: "100px",
    class: "p-0 filled-td",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = utilsStore.filters["role"];
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

  let response = await getRoles(params);
  roles.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const cleanSelectedRoles = () => {
  selectedRoles.value = [];
  onSelectionChanged();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedRoles.value);
};

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedRoles,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

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
