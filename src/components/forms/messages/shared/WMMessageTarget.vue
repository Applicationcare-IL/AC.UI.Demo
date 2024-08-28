<template>
  <div class="flex gap-2">
    <WMSelectableButtonGroup
      name="target"
      :options="options"
      :value="props.message.target ? props.message.target : options[0]"
      @update:selected-option="handleSelectedOption($event.value)"
    />
  </div>
  <!-- <pre>{{ message }}</pre> -->
  <div class="flex flex-column gap-5 py-4">
    <WMMessageTargetServices v-if="unref(selectedOption) === 'service'" :message="message" />
    <WMMessageTargetCustomers v-if="unref(selectedOption) === 'customer'" :message="message" />
    <WMMessageTargetProjects v-if="unref(selectedOption) === 'project'" :message="message" />
    <WMMessageTargetUsers v-if="unref(selectedOption) === 'employee'" :message="message" />
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { onMounted, ref, unref } from "vue";
import { useI18n } from "vue-i18n";

// DEPENDENCIES
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  message: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const selectedOption = ref("papope");

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
    label: t("message.customers"),
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
  handleChangeTarget(option);
};

const { handleChange: handleChangeTarget } = useField("target", undefined, { initialValue: null });

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (props.message && props.message.target) {
    handleSelectedOption(props.message.target);
  }
});
</script>

<style scoped></style>
