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
      class="custom-input-search__input mb-3"
      :options="serviceAreas"
      :option-set="true"
      @update:model-value="updateSelectedServiceAreas"
    />

    <div class="flex flex-column gap-3">
      <WMInput
        v-model="dueDate"
        :value="dueDate"
        name="payment_date"
        type="date"
        :label="$t('due-date') + ':'"
        required
      />

      <WMInput
        v-model="expectedDecisionDate"
        :value="expectedDecisionDate"
        name="payment_date"
        type="date"
        :label="$t('project.expected-decision-date') + ':'"
        required
      />
    </div>

    <WMButton
      class="mt-4"
      :text="$t('buttons.add')"
      type="primary"
      :disabled="selectedServiceAreas == 0"
      :is-disabled="selectedServiceAreas == 0"
      @click="
        handleAddButton();
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

const dueDate = ref(new Date());
const expectedDecisionDate = ref(new Date());

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

const handleAddButton = () => {
  let data = {
    newServiceAreas: selectedServiceAreas.value,
    due_date: dueDate.value,
    expected_decision_date: expectedDecisionDate.value,
  };

  emit("addServiceAreas", data);
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
