<template>
  <!-- <pre>lazyParams: {{ lazyParams }}</pre> -->
<!--   <pre>{{ messages }}</pre>-->
  <DataTable
      v-model:selection="selectedMessages"
      lazy
      :value="messages"
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
        <WMMessagePreviewSidebar v-model:visible="isPreviewVisible[data.id]" :message="data" />
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
  <pre>{{ messages }}</pre>
</template>

<script setup>
// IMPORTS
import { ref, watch, watchEffect } from "vue";

import useAdminMessages from "@/composables/useAdminMessages";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getMessages } = useAdminMessages();

// INJECT

// PROPS, EMITS
defineProps({
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
});

const emit = defineEmits(["update:selection"]);

// REFS
const selectedMessages = ref([]);
const totalRecords = ref(0);
const messages = ref([]);
const lazyParams = ref({});

const utilsStore = useUtilsStore();
const searchValue = ref("");

const isPreviewVisible = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  // const filters = utilsStore.filters["message"];
  const nextPage = lazyParams.value.page + 1;
  // const searchValueParam = searchValue.value;

  const params = new URLSearchParams({
    // ...filters,
    page: nextPage ? nextPage : 1,
    per_page: 10,
  });

  // if (searchValueParam) {
  //   params.append("search", searchValueParam);
  // }

  let response = await getMessages(params);
  messages.value = response.data;
  totalRecords.value = response.totalRecords;
};

loadLazyData();

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData();
};

const onSelectionChanged = () => {
  emit("update:selection", selectedMessages.value);
};

const cleanSelectedMessages = () => {
  selectedMessages.value = [];
  onSelectionChanged();
};

const openSidebar = (data) => {
  isPreviewVisible.value[data] = true;
};

// PROVIDE, EXPOSE
defineExpose({
  loadLazyData,
  cleanSelectedMessages,
});

// WATCHERS
watchEffect(() => {
  loadLazyData();
});

watch(
    () => utilsStore.searchString["message"],
    () => {
      searchValue.value = utilsStore.searchString["message"];
      utilsStore.debounceAction(() => {
        loadLazyData();
      });
    },
    { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
