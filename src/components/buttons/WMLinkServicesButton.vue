<template>
  <WMTempButton
    :text="$t('buttons.link-services')"
    type="type-4"
    :is-disabled="selectedElements.length < 1"
    @click="toggle"
  >
    <template #customIcon>
      <div class="d-flex" v-html="TreeIcon" />
    </template>
  </WMTempButton>

  <OverlayPanel ref="op">
    <div class="flex flex-column w-15rem">
      <span class="h6 mb-1">{{ $t("service.relation-type") }}</span>
      <Dropdown
        v-model="selectedRelationType"
        :options="relationTypes"
        :option-label="optionLabelWithLang"
        class="w-full md:w-10rem mb-5"
      />
      <WMTempButton
        class="ml-auto"
        :text="$t('buttons.link-services')"
        type="type-4"
        @click="handleLinkServices"
      />
    </div>
  </OverlayPanel>
</template>

<script setup>
import { onMounted, ref } from "vue";

import TreeIcon from "/icons/account_tree.svg?raw";
import { useOptionSetsStore } from "@/stores/optionSets";

const { optionLabelWithLang } = useLanguages();
const optionSetsStore = useOptionSetsStore();

// const { linkServices } = useServices();

defineProps({
  selectedElements: Array,
});

const selectedRelationType = ref();
const relationTypes = ref();

const op = ref();

const toggle = (event) => {
  op.value.toggle(event);
};

const linkService = () => {
  console.log("link services");
  // linkServices(selectedElements, selectedRelationType.value);
};

onMounted(async () => {
  relationTypes.value = await optionSetsStore.getOptionSetValues(
    "service_related_relationship"
  );

  selectedRelationType.value = relationTypes.value[0];
});
</script>

<style scoped></style>