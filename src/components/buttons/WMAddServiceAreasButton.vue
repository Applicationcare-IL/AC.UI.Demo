<template>
  <WMNewButton :text="$t('project.add_service_area')" @click="toggle" />

  <OverlayPanel ref="isOpen" :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
    <WMInputSearch
      ref="inputSearch"
      name="service-areas"
      :placeholder="$t('project.service-area-placeholder')"
      :multiple="true"
      :model-value="selectedServiceAreas"
      theme="purple"
      width="248"
      class="custom-input-search__input"
      :options="serviceAreas"
      :option-set="true"
      @update:model-value="updateSelectedServiceAreas"
    />

    <WMTempButton
      class="mt-4"
      :text="$t('buttons.add')"
      type="primary"
      :disabled="selectedServiceAreas == 0"
      @click="
        emit('addServiceAreas', selectedServiceAreas);
        resetSelectedServiceAreas();
      "
    />
  </OverlayPanel>
</template>
<script setup>
import { onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const { layoutConfig } = useLayout();

const emit = defineEmits(["addServiceAreas"]);

const selectedServiceAreas = ref([]);
const serviceAreas = ref({});

const updateSelectedServiceAreas = (event) => {
  selectedServiceAreas.value = event;
};

const resetSelectedServiceAreas = () => {
  selectedServiceAreas.value = [];
};

const isOpen = ref();
const toggle = (event) => {
  isOpen.value.toggle(event);
};

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi("service_area").then((data) => {
    serviceAreas.value = data;
  });
});
</script>

<style scoped lang="scss"></style>
