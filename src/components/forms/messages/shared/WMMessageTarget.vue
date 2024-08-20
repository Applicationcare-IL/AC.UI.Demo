<template>
  <h2 class="h2 my-0">{{ $t("message.target") }}</h2>

  <div class="flex gap-2">
    <WMSelectableButtonGroup
      name="target"
      :options="options"
      @update:selected-option="handleSelectedOption"
    />
  </div>

  <div class="flex flex-column gap-5">
    <WMMessageTargetServices v-if="selectedOption?.value === 'service'"/>
    <WMMessageTargetCustomers v-if="selectedOption?.value === 'customer'"/>
    <WMMessageTargetProjects v-if="selectedOption?.value === 'project'"/>
    <WMMessageTargetUsers v-if="selectedOption?.value === 'employee'"/>
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { t } = useI18n();

// INJECT

// PROPS, EMITS
defineProps({
  message: {
    type: Object,
    default: null,
  },
});

// REFS
const selectedOption = ref(null);

const options = ref([
  {
    label: t("employee.employees"),
    value: "employee",
  },
  {
    label: t("project.projects"),
    value: "project",
  },
  // {
  //   label: t("sale.sales"),
  //   value: "sale",
  // },
  {
    label: t("customer.customers"),
    value: "customer",
  },
  {
    label: t("service.services"),
    value: "service",
  },
]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleSelectedOption = (option) => {
  selectedOption.value = option;
  handleChangeTarget(option.value);
};

const { handleChange: handleChangeTarget } = useField("target", undefined, { initialValue: null });

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
