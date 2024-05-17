<template>
  <SelectButton
    v-model="selectedOption"
    :options="options"
    option-label="name"
    option-value="value"
    class="flex flex-nowrap"
    :allow-empty="false"
    @change="onChangeStateFilter"
  />
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const { t } = useI18n();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  entity: String,
  type: {
    type: String,
    default: "state",
    validator: (value) => {
      // type state = update the globally related state stored in Pinia
      // type event = emits event with the selected state
      return ["state", "event"].includes(value);
    },
  },
});

const emit = defineEmits(["update:state"]);

// REFS
const options = ref([]);
const selectedOption = ref("all");

// COMPUTED

// COMPONENT METHODS AND LOGIC
const onChangeStateFilter = (event) => {
  if (props.type === "event") {
    handleEventTypeLogic(event);
  } else {
    handleStateTypeLogic(event);
  }
};

const handleEventTypeLogic = (event) => {
  emit("update:state", event.value);
};

const handleStateTypeLogic = (event) => {
  if (event.value === "all") {
    delete utilsStore.filters[props.entity]["state"];
  } else {
    utilsStore.filters[props.entity] = {
      ...utilsStore.filters[props.entity],
      state: event.value,
    };
  }
};

const mountEventTypeOptions = (activeStateId, notActiveStateId) => {
  options.value.push({ name: t("state.active"), value: activeStateId });
  options.value.unshift({
    name: t("state.not-active"),
    value: notActiveStateId,
  });
};

const mountStateTypeOptions = (activeStateId, notActiveStateId) => {
  options.value.push({ name: t("state.all"), value: "all" });
  options.value.unshift({ name: t("state.active"), value: activeStateId });
  options.value.unshift({
    name: t("state.not-active"),
    value: notActiveStateId,
  });
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => utilsStore.filters[props.entity],
  () => {
    if (utilsStore.filters[props.entity] && utilsStore.filters[props.entity].state) {
      selectedOption.value = utilsStore.filters[props.entity].state;
    } else {
      selectedOption.value = "all";
    }
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  const activeStateId = await optionSetsStore.getValueId("state", "active");
  const notActiveStateId = await optionSetsStore.getValueId("state", "not_active");

  if (props.type === "event") {
    mountEventTypeOptions(activeStateId, notActiveStateId);
    return;
  }

  mountStateTypeOptions(activeStateId, notActiveStateId);

  // set the selected option based on the current state stored in the app state
  if (utilsStore.filters[props.entity] && utilsStore.filters[props.entity].state) {
    selectedOption.value = utilsStore.filters[props.entity].state;
  }
});
</script>
