<template>
  <h2 class="h2 my-0">{{ $t("message.target") }}</h2>

  <div class="flex gap-2">
    <WMSelectableButtonGroup
      name="target"
      :options="options"
      :value="props.message.target"
      @update:selected-option="handleSelectedOption"
    />
  </div>
  <pre>{{ selectedOption }}</pre>
  <div class="flex flex-column gap-5">
    <WMMessageTargetServices v-if="selectedOption?.value === 'service'" :message="message"/>
    <WMMessageTargetCustomers v-if="selectedOption?.value === 'customer'" :message="message"/>
    <WMMessageTargetProjects v-if="selectedOption?.value === 'project'" :message="message"/>
    <WMMessageTargetUsers v-if="selectedOption?.value === 'employee'" :message="message"/>

    <pre>{{ props.message }}</pre>
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import {onMounted, ref} from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  message: {
    type: Object,
    default: null,
  },
});

// REFS
const selectedOption = ref('papope');

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
onMounted(() => {
  handleSelectedOption(props.message.target);
  console.log(props.message.target);
});
</script>

<style scoped></style>
