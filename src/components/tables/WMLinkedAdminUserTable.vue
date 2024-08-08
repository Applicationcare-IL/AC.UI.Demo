<template>
  <div class="flex flex-column w-full">
    <h2 class="h2">
      <slot name="title" />
    </h2>

    <div class="flex flex-column gap-3 mb-3">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row gap-2">
          <WMSelectAdminUsersButton @users-selected="addSelectedUsers" />
          <WMRemoveButton
            :text="$t('buttons.remove-users')"
            :is-disabled="!selectedUsers.length > 0"
            @click="removeSelectedUsers"
          />
        </div>
      </div>
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row">
          <WMSearchBox v-model="searchValue" entity="contact" />
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup>
// IMPORTS
import { ref, watchEffect } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getUsers } = useAdminUsers();
const { addUsers: addUsersToTeam, removeUsers: removeUsersFromTeam } = useAdminTeams();

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

const addSelectedUsers = async (users) => {
  const userIds = users.map((user) => user.id);

  await addUsersToTeam(props.relatedEntityId, { employees: userIds });

  loadLazyData();
};

const removeSelectedUsers = async () => {
  const userIds = selectedUsers.value.map((user) => user.id);

  await removeUsersFromTeam(props.relatedEntityId, { employees: userIds });

  cleanSelectedUsers();
  loadLazyData();
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

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
