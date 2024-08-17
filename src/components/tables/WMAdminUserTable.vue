<template>
  <DataTable
    v-model:selection="selectedUsers"
    lazy
    :value="users"
    data-key="id"
    scrollable
    paginator
    :rows="10"
    :total-records="totalRecords"
    class="w-full"
    @page="onPage($event)"
    @update:selection="onSelectionChanged"
  >
    <Column v-if="selectable" style="width: 40px" selection-mode="multiple" />
    <Column v-if="preview" style="width: 40px">
      <template #body="{ data }">
        <img
          src="/icons/eye.svg"
          alt=""
          class="vertical-align-middle"
          @click="openSidebar(data.id)"
        />
        <WMUserPreviewSidebar v-model:visible="isPreviewVisible[data.id]" :user="data" />
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
import { ref, watch, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  preview: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: String,
    required: true,
  },
  relatedEntityId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:selection"]);

// REFS
const selectedUsers = ref([]);
const totalRecords = ref(0);
const users = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

const isPreviewVisible = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const filters = utilsStore.filters["employee"];
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

  if (props.relatedEntity && props.relatedEntityId) {
    params.append(props.relatedEntity, props.relatedEntityId);
  }

  let response = await getUsers(params);
  users.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedUsers.value);
};

const cleanSelectedUsers = () => {
  selectedUsers.value = [];
  onSelectionChanged();
};

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// const onPage = (event) => {
//   console.log(event);
// };

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedUsers,
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
