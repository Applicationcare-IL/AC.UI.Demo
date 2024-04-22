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
// IMPORTS
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import TreeIcon from "/icons/account_tree.svg?raw";
import { useOptionSetsStore } from "@/stores/optionSets";
// DEPENDENCIES
const { t } = useI18n();
const { optionLabelWithLang } = useLanguages();
const optionSetsStore = useOptionSetsStore();
const toast = useToast();
const { linkServices } = useServices();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedElements: Array,
});

// REFS
const selectedRelationType = ref();
const relationTypes = ref();
const op = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const toggle = (event) => {
  op.value.toggle(event);
};

const handleLinkServices = async () => {
  const mappedSelectedElements = props.selectedElements.map(
    (element) => element.id
  );

  await linkServices(mappedSelectedElements, selectedRelationType.value.id);

  toast.info({
    message: t("service.toast-services-linked-message"),
    title: t("service.toast-services-linked-title"),
    life: 5000,
    group: "br",
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)

onMounted(async () => {
  relationTypes.value = await optionSetsStore.getOptionSetValues(
    "service_related_relationship"
  );

  selectedRelationType.value = relationTypes.value[0];
});
</script>

<style scoped></style>
