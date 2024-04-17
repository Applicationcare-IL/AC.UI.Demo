<template>
  <WMTempButton
    :text="$t('buttons.link-service')"
    type="type-4"
    @click="toggle"
  >
    <template #customIcon>
      <div class="d-flex" v-html="TreeIcon" />
    </template>
  </WMTempButton>

  <OverlayPanel ref="op">
    <div class="flex flex-column w-auto">
      <span class="h6 mb-1">{{ $t("service.relation-type") }}</span>
      <Dropdown
        v-model="selectedRelationType"
        :options="relationTypes"
        :option-label="optionLabelWithLang"
        class="w-full md:w-10rem mb-5"
      />

      <span class="h6 mb-1">{{ $t("service.what-to-link") }}</span>
      <SelectButton
        v-model="selectedOption"
        :options="options"
        option-label="label"
      />

      <WMTempButton
        class="ml-auto"
        :text="$t('buttons.link-services')"
        type="type-4"
        @click="handleLinkServices"
      />
    </div>
  </OverlayPanel>

  <WMExistingRelatedServicesDialog v-if="showExistingRelatedServicesDialog" />
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
// const toast = useToast();
// const { linkServices } = useServices();

// INJECT

// PROPS, EMITS

// REFS
const selectedRelationType = ref();
const relationTypes = ref();
const op = ref();
const showExistingRelatedServicesDialog = ref(false);

const options = [
  { label: t("service.link-existing-service"), value: "existing" },
  { label: t("service.link-new-service"), value: "new" },
];

const selectedOption = ref(options[0]);

// COMPUTED

// COMPONENT METHODS
const toggle = (event) => {
  op.value.toggle(event);
};

const handleLinkServices = async () => {
  if (selectedOption.value.value === "existing") {
    showExistingRelatedServicesDialog.value = true;
    return;
  }

  // toast.info({
  //   message: t("service.services-linked-message"),
  //   title: t("service.services-linked-title"),
  //   life: 5000,
  //   group: "br",
  // });
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
