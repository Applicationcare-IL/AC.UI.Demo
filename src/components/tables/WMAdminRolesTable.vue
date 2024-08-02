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
    <Column>
      <template #body="{ data }">
        <img
            src="/icons/eye.svg"
            alt=""
            class="vertical-align-middle"
            @click="openSidebar(data.id)"
        />
        <WMRolePreviewSidebar v-model:visible="isPreviewVisible[data.id]" :role="data"/>
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
import {ref} from "vue";

import useAdminRoles from "@/composables/useAdminRoles";
import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const { getRoles } = useAdminRoles()


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
    header: "Role name",
  },
  {
    name: "users",
    type: "text",
    field: "users",
    header: "Users in role",
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
  const nextPage = lazyParams.value.page + 1;

  const params = {
    page: nextPage,
    per_page: 10,
  };

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
}

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedRoles,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
