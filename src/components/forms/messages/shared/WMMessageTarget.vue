<template>
  <h2 class="h2 my-0">{{ $t('message.target') }}</h2>

  <div class="flex gap-2">
    <WMSelectableButtonGroup
        :options="options"
        @update:selected-option="handleSelectedOption"
    />
  </div>

  <div class="flex flex-column gap-5">
    <WMMessageTargetServices v-if="selectedOption?.value === 'services'"/>
    <WMMessageTargetCustomers v-if="selectedOption?.value === 'customers'"/>
    <WMMessageTargetProjects v-if="selectedOption?.value === 'projects'"/>
    <WMMessageTargetUsers v-if="selectedOption?.value === 'users'"/>
  </div>

</template>

<script setup>
// IMPORTS
import {ref} from "vue";
import {useI18n} from "vue-i18n";

// DEPENDENCIES
const {t} = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  message: {
    type: Object,
    default: null
  }
})

// REFS
const selectedOption = ref(null);

const options = ref([
  {
    label: t("employee.employees"),
    value: "users",
  },
  {
    label: t("project.projects"),
    value: "projects",
  },
  // {
  //   label: t("sale.sales"),
  //   value: "sales",
  // },
  {
    label: t("customer.customers"),
    value: "customers",
  },
  {
    label: t("service.services"),
    value: "services",
  },
]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleSelectedOption = (option) => {
  selectedOption.value = option;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
