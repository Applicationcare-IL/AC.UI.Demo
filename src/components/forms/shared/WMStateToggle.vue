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
import { onMounted, ref } from "vue";
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
});

// REFS
const options = ref([{ name: t("state.all"), value: "all" }]);
const selectedOption = ref("all");

// COMPUTED

// COMPONENT METHODS
const onChangeStateFilter = (event) => {
  if (event.value === "all") {
    delete utilsStore.filters[props.entity]["state"];
  } else {
    utilsStore.filters[props.entity] = {
      ...utilsStore.filters[props.entity],
      state: event.value,
    };
  }
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  const activeStateId = await optionSetsStore.getValueId("state", "active");
  const notActiveStateId = await optionSetsStore.getValueId("state", "not_active");

  options.value.unshift({ name: t("state.active"), value: activeStateId });
  options.value.unshift({
    name: t("state.not-active"),
    value: notActiveStateId,
  });
});
</script>
