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
  entity: {
    type: String,
  },
  team: {
    type: Boolean,
    default: false,
  },
});

const onChangeOwnerFilter = (event) => {
  if (event.value === "all") {
    delete utilsStore.filters[props.entity]["employee"];
  } else {
    utilsStore.filters[props.entity] = {
      ...utilsStore.filters[props.entity],
      employee: authStore.user?.id,
    };
  }
};

const getEntityPlural = () => {
  return props.entity + "." + props.entity + "s";
};

const pluralEntityName = computed(() => {
  return props.entity + "s";
});

const allEntitiesLabel = computed(() => {
  if (props.team) {
    return t("teams-entities", { label: getEntityPlural() }, { escapeParameter: true });
  }
  return t("all-entities", { label: getEntityPlural() });
});

const options = computed(() => {
  const options = [{ name: t("my-entities", { label: getEntityPlural() }), value: "my" }];

  if (permissionsStore.permissions[pluralEntityName.value]?.all) {
    options.push({
      name: allEntitiesLabel.value,
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
