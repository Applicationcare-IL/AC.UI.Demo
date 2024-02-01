<template>
  <div class="mb-5 p-3 py-3">
    <h2 class="h2">New service</h2>
    <WMInput
      name="owner"
      type="info"
      :highlighted="true"
      :label="$t('owner')"
      value="Me"
      class="mb-3"
    />

    <WMInput
      v-model="selectedUrgency"
      name="priority"
      type="input-select"
      :highlighted="true"
      :label="$t('priority') + ':'"
      :options="urgencies"
      width="130"
      option-set
    />

    <WMInputSearch
      class="mt-3"
      name="short-classification"
      :highlighted="true"
      :label="$t('short-classification') + ':'"
      :options="quickCodes"
      width="300"
      :placeholder="$t('select', ['short-classification'])"
      @change="handleQuickCodeChange"
    />

    <WMInput
      id="description"
      v-model="description"
      :label="$t('service.description')"
      type="text-area"
      name="description"
      width="300"
    />

    <h3 class="h3">Location data</h3>

    <WMInputSearch
      name="site-name"
      type="input-search"
      :label="$t('site.name') + ':'"
      width="300"
      :options="sites"
      :highlighted="true"
      option-set
    />

    <Button
      label="Save"
      size="large"
      class="w-full p-4 mt-5"
      severity="success"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const { getQuickCodes } = useServices();

const description = ref("");

const quickCodes = ref([]);
const urgencies = ref([]);
const selectedUrgency = ref(null);

const sites = ref(optionSetsStore.optionSets["service_site"]);

const handleQuickCodeChange = (value) => {
  console.log(value);
};

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi("service_urgent").then((data) => {
    urgencies.value = data;
    selectedUrgency.value = data[0];
  });

  getQuickCodes().then((data) => {
    quickCodes.value = data.data;
  });
});
</script>

<style scoped lang="scss"></style>
