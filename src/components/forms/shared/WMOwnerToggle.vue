<template>
  <SelectButton
    v-if="options.length > 1"
    v-model="selectedOption"
    :options="options"
    option-label="name"
    option-value="value"
    class="flex flex-nowrap"
    :allow-empty="false"
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
  console.log("onChangeOwnerFilter", event.value, props.entity);

  if (event.value === "all") {
    delete utilsStore.filters[props.entity]["employee"];
  } else {
    utilsStore.filters[props.entity] = {
      ...utilsStore.filters[props.entity],
      employee: authStore.user?.id,
    };
  }

  console.log("utilsStore.filters[props.entity],", utilsStore.filters[props.entity]);
};

const getEntityPlural = () => {
  return props.entity + "." + props.entity + "s";
};

const pluralEntityName = computed(() => {
  return props.entity + "s";
});

const options = computed(() => {
  const options = [{ name: t("my-entities", { label: getEntityPlural() }), value: "my" }];

  if (permissionsStore.permissions[pluralEntityName.value]?.all) {
    options.push({
      name: t("all-entities", { label: getEntityPlural() }),
      value: "all",
    });
  }

  return options;
});

// TEMPORAL FIX
const getSelectedOptionBasedOnPermissions = () => {
  if (permissionsStore.permissions[pluralEntityName.value]?.all) {
    return "all";
  } else {
    return "my";
  }
};

// if the user has the all permision to false, set the filter to the current user, what its the same as 'my' option
const setFilterBasedOnPermissions = () => {
  if (permissionsStore.permissions[pluralEntityName.value]?.all === false) {
    utilsStore.filters[props.entity] = { employee: authStore.user?.id };
  }
};

setFilterBasedOnPermissions();

setTimeout(() => {
  setFilterBasedOnPermissions();
}, 1000);

const selectedOption = ref(getSelectedOptionBasedOnPermissions());
</script>
