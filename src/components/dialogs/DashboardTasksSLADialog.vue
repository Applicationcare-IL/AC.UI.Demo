<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('dashboard.tasks-distribution-by-sla')"
    :style="{ width: '1200px' }"
  >
    <div class="flex" :style="{ minHeight: '350px' }">
      <div class="w-6 flex">
        <SLAChart v-if="tasksSLAData" :data="tasksSLAData" />
      </div>
      <Divider layout="vertical" />
      <div class="w-6">
        <WMSLATable
          :data="tasksSLATableData"
          entity="tasks_sla"
          @update:search-text="handleUpdateSearchText"
          @update:selected-row="handleUpdateSelectedRow"
          @update:owner="handleUpdateOwner"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { getTasksSLADistribution, getTasksSLATableData } = useTasks();

const modelValue = defineModel();

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});

const tasksSLAData = ref(null);
const tasksSLATableData = ref(null);

const searchText = ref("");
const selectedRow = ref(null);
const owner = ref(null);

const handleUpdateSearchText = (value) => {
  searchText.value = value;

  fetchData();
};

const handleUpdateSelectedRow = (value) => {
  selectedRow.value = value;

  fetchData();
};

const handleUpdateOwner = (value) => {
  if (value === "team") {
    owner.value = null;
  } else {
    owner.value = authStore.user?.id;
  }

  fetchData();
};

onMounted(async () => {});

const fetchData = async () => {
  const params = {};

  if (searchText.value) {
    params.search = searchText.value;
  }

  if (owner.value) {
    params.employee = owner.value;
  }

  // we only want to filter the SLA by task family
  tasksSLAData.value = await getTasksSLADistribution({
    ...props.filters,
    ...params,
    // area: selectedRow.value?.area_id,
  });

  tasksSLATableData.value = await getTasksSLATableData(params);
};

onMounted(async () => {
  await fetchData();
});
</script>

<style scoped></style>
