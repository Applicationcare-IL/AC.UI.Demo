<template>
  <!-- {{ permissionsStore.permissions[getEntityPlural()] }} -->
  <SelectButton
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
import { usePermissionsStore } from "@/stores/permissionsStore";
import { useUtilsStore } from "@/stores/utils";

const permissionsStore = usePermissionsStore();

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

const getEntityPlural = () => {
  return props.entity + "." + props.entity + "s";
};

const getSelectFilterButtonValues = () => {
  return [
    { name: t("all-entities", { label: getEntityPlural() }), value: "all" },
    { name: t("my-entities", { label: getEntityPlural() }), value: "my" },
  ];
};

const options = ref(getSelectFilterButtonValues());

// TEMPORAL FIX
const getSelectedOptionBasedOnPermissions = () => {
  if (permissionsStore.permissions[getEntityPlural()]?.all) {
    return "all";
  } else {
    return "my";
  }
};

const selectedOption = ref(getSelectedOptionBasedOnPermissions());
</script>
