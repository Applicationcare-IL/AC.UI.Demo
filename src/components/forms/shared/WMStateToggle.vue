<template>
  <SelectButton
    v-if="options.length > 1"
    v-model="selectedOption"
    :options="options"
    option-label="name"
    option-value="value"
    class="flex flex-nowrap"
    @change="onChangeOwnerFilter"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useAuthStore } from "@/stores/auth";
import { useUtilsStore } from "@/stores/utils";

const authStore = useAuthStore();

const { t } = useI18n();
const utilsStore = useUtilsStore();

const props = defineProps({
  entity: String,
});

const onChangeOwnerFilter = (event) => {
  if (event.value === "all")
    delete utilsStore.filters[props.entity]["employee"];
  else utilsStore.filters[props.entity] = { employee: authStore.user?.id };
};

const options = [
  { name: t("state.all"), value: "all" },
  { name: t("state.active"), value: "active" },
  { name: t("state.not-active"), value: "not-active" },
];

// // if the user has the all permision to false, set the filter to the current user, what its the same as 'my' option
// const setFilterBasedOnPermissions = () => {
//   if (permissionsStore.permissions[pluralEntityName.value]?.all === false) {
//     utilsStore.filters[props.entity] = { employee: authStore.user?.id };
//   }
// };

// setFilterBasedOnPermissions();

// setTimeout(() => {
//   setFilterBasedOnPermissions();
// }, 1000);

// const selectedOption = ref(getSelectedOptionBasedOnPermissions());
</script>
