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
          size="md"
          option-set
          @update:selected-item="updateSelectedServiceAreas"
        />
      </div>

      <div class="flex gap-3">
        <WMInput
          v-model="dueDate"
          :value="dueDate"
          name="due_date"
          type="date"
          :label="$t('due-date') + ':'"
          required
          size="sm"
        />

        <WMInput
          v-model="expectedDecisionDate"
          :value="expectedDecisionDate"
          name="expected_decision_date"
          type="date"
          :label="$t('project.expected-decision-date') + ':'"
          required
          size="sm"
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
// IMPORTS
import { onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { formatDateToAPI } = useDates();
const optionSetsStore = useOptionSetsStore();

const { layoutConfig } = useLayout();

// INJECT

// PROPS, EMITS

const emit = defineEmits(["addServiceAreas"]);

// REFS
const dueDate = ref(new Date());
const expectedDecisionDate = ref(new Date());

const selectedServiceAreas = ref([]);
const serviceAreas = ref({});

const isOpen = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
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

const toggle = (event) => {
  isOpen.value.toggle(event);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi("service_area").then((data) => {
    serviceAreas.value = data;
  });
});
</script>

<style scoped lang="scss"></style>
