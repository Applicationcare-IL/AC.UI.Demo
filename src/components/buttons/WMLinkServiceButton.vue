<template>
  <WMTempButton
    :text="$t('buttons.link-service')"
    type="type-4"
    @click="toggle"
  >
    <template #customIcon>
      <div class="flex" v-html="TreeIcon" />
    </template>
  </WMTempButton>

  <OverlayPanel ref="op">
    <div class="flex flex-column w-20rem">
      <span class="h6 mb-1">{{ $t("service.relation-type") }}</span>
      <Dropdown
        v-model="selectedRelationType"
        :options="relationTypes"
        :option-label="optionLabelWithLang"
        class="w-full md:w-10rem mb-3"
      />

      <span class="h6 mb-1">{{ $t("service.what-to-link") }}</span>
      <SelectButton
        v-model="selectedOption"
        :options="options"
        option-label="label"
        class="flex"
        :allow-empty="false"
      />

      <WMTempButton
        class="ml-auto mt-4"
        :text="$t('buttons.link-services')"
        type="type-4"
        @click="handleLinkServices"
      />
    </div>
  </OverlayPanel>

  <WMExistingRelatedServicesDialog
    v-if="showExistingRelatedServicesDialog"
    v-model="showExistingRelatedServicesDialog"
    @link-service="handleLinkService"
  />

  <WMSidebar
    :visible="isNewRelatedServiceSidebarVisible"
    name="newRelatedService"
    @close-sidebar="closeNewRelatedServiceSidebar"
    @open-sidebar="openNewRelatedServiceSidebar"
  >
    <div class="m-3">
      <div class="flex flex-row justify-content-between align-content-center">
        <h1 class="h1 mb-0">
          {{ $t("service.new-related-service") }}
        </h1>
      </div>
      <Divider />
    </div>
    <WMNewServiceForm
      :is-sidebar="true"
      :is-related-service="true"
      @close-sidebar="closeNewRelatedServiceSidebar"
      @new-service-created="handleLinkNewService"
    />
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import { computed, onMounted, provide, ref } from "vue";
import { useI18n } from "vue-i18n";

import TreeIcon from "/icons/account_tree.svg?raw";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { t } = useI18n();
const { optionLabelWithLang } = useLanguages();
const optionSetsStore = useOptionSetsStore();
const toast = useToast();
const { linkService, getServiceFromApi } = useServices();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["newServiceLinked"]);

// REFS
const selectedRelationType = ref();
const relationTypes = ref();
const op = ref();
const showExistingRelatedServicesDialog = ref(false);
const isNewRelatedServiceSidebarVisible = ref(false);

const options = [
  { label: t("service.link-existing-service"), value: "existing" },
  { label: t("service.link-new-service"), value: "new" },
];

const selectedOption = ref(options[0]);

// COMPUTED
const currentServiceId = computed(() => {
  return utilsStore.selectedElements[utilsStore.entity][0].id;
});

// COMPONENT METHODS AND LOGIC
const toggle = (event) => {
  op.value.toggle(event);
};

const handleLinkServices = async () => {
  if (selectedOption.value.value === "existing") {
    showExistingRelatedServicesDialog.value = true;
    return;
  }

  openNewRelatedServiceSidebar();
  op.value.hide();
};

const showLinkServiceToast = () => {
  toast.success({
    message: t("service.toast-services-new-related-message"),
    title: t("service.toast-services-new-related-title"),
    life: 5000,
    group: "br",
  });
};

const handleLinkService = async (relatedService) => {
  await linkService(
    currentServiceId.value,
    relatedService.id,
    selectedRelationType.value.id
  );

  showLinkServiceToast();

  relatedService = {
    ...relatedService,
    relationship: selectedRelationType.value,
  };

  emit("newServiceLinked", relatedService);
};

const handleLinkNewService = async (newServiceData) => {
  await linkService(
    currentServiceId.value,
    newServiceData.id,
    newServiceData.relationType.id
  );

  showLinkServiceToast();

  let relatedService = await getServiceFromApi(newServiceData.id);

  relatedService = {
    ...relatedService,
    relationship: selectedRelationType.value,
  };

  emit("newServiceLinked", relatedService);
};

function closeNewRelatedServiceSidebar() {
  isNewRelatedServiceSidebarVisible.value = false;
}

function openNewRelatedServiceSidebar() {
  isNewRelatedServiceSidebarVisible.value = true;
}

// PROVIDE, EXPOSE
provide("preselectedRelationType", selectedRelationType);

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
