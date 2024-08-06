<template>
  <div class="wm-subheader pb-2 shadow-2 flex-none">
    <div class="flex flex-column gap-3">
      <div v-if="showHeader" class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <div class="flex flex-row flex-wrap gap-2">
          <WMNewButton
            v-if="can(utilsStore.pluralEntity + '.create') && entity != 'asset'"
            :text="$t('buttons.new')"
            @click="$emit('new')"
          />

          <WMNewButton
            v-if="entity == 'asset'"
            :text="$t('buttons.new') + ' ' + $t('service.service')"
            :disabled="utilsStore.selectedElements['asset']?.length != 1"
            @click="$emit('new')"
          />

          <WMLinkServicesButton v-if="entity == 'service'" :selected-elements="selectedElements" />

          <WMButton
            v-if="showExportButton"
            :text="$t('export')"
            type="type-5"
            @click="$emit('export')"
          >
            <template #customIcon>
              <div class="flex" v-html="ExportIcon" />
            </template>
          </WMButton>

          <Divider layout="vertical" />

          <WMCompleteTasksButton
            v-if="entity == 'task'"
            :entity="entity"
            @task-completed="$emit('taskCompleted')"
          />

          <WMDeactivateAssetButton
            v-if="entity == 'asset'"
            :entity="entity"
            @asset-deactivated="$emit('assetDeactivated')"
          />

          <WMAssignOwnerButton
            v-if="can(utilsStore.pluralEntity + '.assign') && entity != 'asset'"
            :entity="entity"
            @owner-assigned="$emit('refreshTable')"
          />

          <WMSendMessageButton
            v-if="entity != 'asset' && showCommunications"
            :selected-elements="selectedElements"
            :multiple="true"
          />

          <WMSendEmailButton
            v-if="can('global.mail') && entity != 'asset' && showCommunications"
            :selected-elements="selectedElements"
            :multiple="true"
          />

          <Divider v-if="scopes && scopes.length" layout="vertical" />

          <WMActionBuilderDropdowns
            v-if="scopes && scopes.length && hasActionBuilder"
            :scopes="scopes"
            :selected-elements="selectedElements"
            @post-action-executed="$emit('refreshTable')"
          />
          <slot name="custom-buttons" />
        </div>
        <div class="flex flex-row align-items-center gap-3">
          <WMStateToggle
            v-if="
              entity === 'task' ||
              entity === 'service' ||
              entity === 'employee' ||
              entity === 'team' ||
              entity === 'role'
            "
            :entity="entity"
          />
          <WMOwnerToggle :entity="entity" />
        </div>
      </div>
      <div class="flex flex-row justify-content-between align-items-center">
        <div class="flex flex-row gap-3">
          <WMSearchBox v-if="showSearchBar" :entity="entity" />

          <WMFilterButton
            v-if="showFilterButton"
            :is-active="isFilterApplied || isFilterVisible"
            @click="openFilterSidebar"
          />
        </div>
        <div class="flex flex-row align-items-center">
          <slot name="paginator" />
        </div>
      </div>
    </div>
  </div>
  <WMSidebar
    :visible="isFilterVisible"
    name="filter"
    @close-sidebar="closeFilterSidebar"
    @open-sidebar="openFilterSidebar"
  >
    <WMFilterForm :entity="props.entity" :filter-form-name="props.entity" />
    hola
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import { computed, ref, watch } from "vue";

import ExportIcon from "/icons/export.svg?raw";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();

const { getScopes } = useActionBuilder();

// INJECT

// PROPS, EMITS
defineEmits(["new", "taskCompleted", "refreshTable", "assetDeactivated", "export"]);

const props = defineProps({
  activeButtons: Boolean,
  defaultOption: Object,
  entity: String,
  hasActionBuilder: {
    type: Boolean,
    default: true,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showFilterButton: {
    type: Boolean,
    default: true,
  },
  showSearchBar: {
    type: Boolean,
    default: true,
  },
  showCommunications: {
    type: Boolean,
    default: true,
  },
});

// REFS

const scopes = ref();
const selectedElements = ref([]);
const isFilterVisible = ref(false);

// COMPUTED
const isFilterApplied = computed(() => {
  if (!utilsStore.filters[props.entity]) return 0;
  return Object.keys(utilsStore.filters[props.entity]).length;
});

// COMPONENT METHODS AND LOGIC
const closeFilterSidebar = () => {
  isFilterVisible.value = false;
};

const openFilterSidebar = () => {
  isFilterVisible.value = true;
};

const enetitiesAvailableForExport = ["task", "customer", "contact", "service", "project"];

const showExportButton = computed(() => {
  return (
    can(utilsStore.pluralEntity + ".export") && enetitiesAvailableForExport.includes(props.entity)
  );
});

if (props.hasActionBuilder) {
  getScopes(props.entity, "list").then((data) => {
    scopes.value = data;
  });
}

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => utilsStore.selectedElements[props.entity],
  (value) => {
    selectedElements.value = value;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
