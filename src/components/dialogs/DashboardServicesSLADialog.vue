<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="$t('dashboard.services-distribution-by-sla')"
    :style="{ minWidth: '30vw' }"
  >
    <div v-if="modelValue" class="flex" :style="{ minHeight: '250px' }">
      <SLAChart v-if="servicesSLAData" :data="servicesSLAData" />
      <Divider layout="vertical" />
      <div class="w-6">
        <WMSLATable
          :data="servicesSLATableData"
          entity="services_sla"
          @update:search-text="handleUpdateSearchText"
          @update:selected-row="handleUpdateSelectedRow"
          @update:owner="handleUpdateOwner"
        />
        <!-- <pre>servicesSLAData {{ servicesSLAData }}</pre> -->
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { getServicesSLADistribution, getServicesSLATableData } = useServices();

const modelValue = defineModel();

const servicesSLAData = ref(null);
const servicesSLATableData = ref(null);

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

const fetchData = async () => {
  const params = {};

  if (searchText.value) {
    params.search = searchText.value;
  }

  if (owner.value) {
    params.employee = owner.value;
  }

  // we only want to filter the SLA distribution by area
  servicesSLAData.value = await getServicesSLADistribution({
    ...params,
    area: selectedRow.value?.area_id,
  });

  servicesSLATableData.value = await getServicesSLATableData(params);
};

onMounted(async () => {
  await fetchData();
});
</script>

<style scoped></style>
