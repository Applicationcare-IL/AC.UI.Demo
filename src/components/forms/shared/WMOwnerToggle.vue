<template>
  <SelectButton
    v-model="selectedOption"
    :options="options"
    optionLabel="name"
    optionValue="value"
    class="flex flex-nowrap"
    @change="onChangeOwnerFilter"
  />
</template>

<script setup>
import { ref } from "vue";
import { useUtilsStore } from "@/stores/utils";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const { t } = useI18n();
const utilsStore = useUtilsStore();

const props = defineProps({
  entity: String,
});

const onChangeOwnerFilter = (event) => {
  console.log(utilsStore.filters["task"]);
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
const selectedOption = ref("all");
</script>
