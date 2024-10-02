<template>
  <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
    <ProgressSpinner />
  </div>
  <div v-else class="wm-new-form-container flex flex-auto flex-column overflow-auto gap-5">
    <div class="flex flex-column gap-5">
      <h3 class="h3 mb-0">{{ $t("general-details") }}</h3>
      <div class="flex flex-row gap-5">
        <WMInput name="name" required type="input-text" :label="$t('trigger.name') + ':'" />
      </div>
      <div class="flex flex-row gap-5">
        <WMInput
          name="description"
          :label="$t('description')"
          label-size="large"
          type="text-area"
          size="xl"
          required
        />
      </div>
      <div class="flex flex-column gap-5">
        <h3 class="h3 mb-0">{{ $t("trigger.event-type") + ":" }}</h3>
        <div class="flex flex-row gap-2">
          <WMSelectableButtonGroup
            name="event-type"
            :options="event_type"
            :no-icon="true"
            @update:selected-option="handleSelectedEvent($event.value)"
          />
        </div>
      </div>
      <div class="flex flex-column gap-5">
        <h3 class="h3 mb-0">{{ $t("entity") + ":" }}</h3>
        <div class="flex flex-row gap-2">
          <WMSelectableButtonGroup
            name="entity"
            :options="entity"
            :no-icon="true"
            @update:selected-option="handleSelectedEntity($event.value)"
          />
        </div>
      </div>
      <div class="flex flex-column gap-5">
        <WMInput
          name="run-once"
          :label="$t('trigger.run-once')"
          type="input-select-button"
          :options="yesNoOptions"
        />
      </div>
    </div>

    <Divider />

    <div class="flex flex-column gap-5">
      <h3 class="h3 mb-0">{{ $t("state") + ":" }}</h3>
      <div class="flex flex-row gap-2">
        <WMSelectableButtonGroup
          name="state"
          :options="stateOptions"
          :no-icon="true"
          @update:selected-option="handleSelectedState($event.value)"
        />
      </div>

      <h3 class="h3 mb-0">{{ $t("status") + ":" }}</h3>
      <div class="flex flex-row gap-2">
        <WMSelectableButtonGroup
          name="state"
          :options="stateOptions"
          :no-icon="true"
          @update:selected-option="handleSelectedState($event.value)"
        />
      </div>
    </div>

    <h3 class="h3 mb-0">{{ $t("sla") + ":" }}</h3>
    <div class="flex flex-row gap-2">
      <WMSelectableButtonGroup
        name="state"
        :options="stateOptions"
        :no-icon="true"
        @update:selected-option="handleSelectedState($event.value)"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS

import { onMounted } from "vue";
import { ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS

// REFS
const loading = ref(false);

const event_type = [
  {
    label: "Create",
    value: "create",
  },
  {
    label: "Assignement",
    value: "assignement",
  },
  {
    label: "Load",
    value: "load",
  },
  {
    label: "Save",
    value: "save",
  },
  {
    label: "Complete",
    value: "complete",
  },
];

const entity = [
  {
    label: "Service",
    value: "service",
  },
  {
    label: "Task",
    value: "task",
  },
  {
    label: "Project",
    value: "project",
  },
  {
    label: "Sale",
    value: "sale",
  },
];

const yesNoOptions = ref();
const event_type_selected = ref();
const entity_selected = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "New Trigger",
});

const loadLazyData = async () => {
  yesNoOptions.value = await optionSetsStore.getOptionSetValues("yesNo");
};

const handleSelectedEvent = (option) => {
  event_type_selected.value = option;
};

const handleSelectedEntity = (option) => {
  entity_selected.value = option;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>

<style scoped></style>
