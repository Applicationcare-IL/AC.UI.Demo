<template>
  <WMNewButton :text="$t('project.add_service_area')" @click="toggle" />

  <OverlayPanel ref="isOpen" :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
    <div class="flex flex-column gap-4">
      <div class="flex">
        <WMInput
          name="service-areas"
          type="input-select"
          :highlighted="true"
          required="true"
          :label="$t('project.service-area') + ':'"
          :options="serviceAreas"
          @update:selectedItem="updateSelectedServiceAreas"
          size="full"
          option-set
        />
      </div>

      <div class="flex gap-3">
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

      <div class="flex justify-content-end">
        <WMButton
          class="mt-3"
          :text="$t('project.add_service_area')"
          type="primary"
          :disabled="selectedServiceAreas == 0"
          :is-disabled="selectedServiceAreas == 0"
          @click="
            handleAddButton();
            resetSelectedServiceAreas();
          "
        />
      </div>
    </div>
  </OverlayPanel>
</template>
<script setup>
import { onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

const { formatDateToAPI } = useDates();
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
    service_area: selectedServiceAreas.value,
    due_date: formatDateToAPI(dueDate.value),
    expected_decision_date: formatDateToAPI(expectedDecisionDate.value),
  };

  isOpen.value.hide();

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
