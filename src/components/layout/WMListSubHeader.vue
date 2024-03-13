<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-5">
      <div class="flex flex-row justify-content-between flex-wrap row-gap-4">
        <div class="flex flex-row flex-wrap">
          <WMButton
            v-if="can(utilsStore.pluralEntity + '.create')"
            class="m-1 col-6"
            name="new"
            icon="new"
            @click="$emit('new')"
          >
            {{ $t("buttons.new") }}
          </WMButton>

          <WMButton
            v-if="can(utilsStore.pluralEntity + '.export')"
            class="m-1 col-6"
            name="export-white"
            icon="export"
          >
            {{ $t("export") }}
          </WMButton>

          <Divider layout="vertical" />

          <WMCompleteTasksButton
            v-if="utilsStore.entity == 'task'"
            :entity="utilsStore.entity"
            @task-completed="$emit('taskCompleted')"
          />

          <WMDeactivateAssetButton
            v-if="utilsStore.entity == 'asset'"
            :entity="utilsStore.entity"
            @asset-deactivated="$emit('assetDeactivated')"
          />

          <WMAssignOwnerButton
            v-if="
              can(utilsStore.pluralEntity + '.assign') &&
              utilsStore.entity != 'asset'
            "
            :entity="utilsStore.entity"
            @owner-assigned="$emit('refreshTable')"
          />

          <WMSendMessageButton
            v-if="utilsStore.entity != 'asset'"
            :selected-elements="selectedElements"
            :multiple="true"
          />

          <!-- <WMButton
            class="m-1 col-6"
            name="phone-white"
            icon="phone"
            :disabled="selectedElements != 1"
          >
            {{ $t("buttons.assign") }}
          </WMButton> -->

          <WMSendEmailButton
            v-if="can('global.mail') && utilsStore.entity != 'asset'"
            :selected-elements="selectedElements"
            :multiple="true"
          />

          <Divider v-if="scopes && scopes.length" layout="vertical" />

          <WMActionBuilderDropdowns
            v-if="scopes && scopes.length"
            :scopes="scopes"
            :selected-elements="selectedElements"
            @post-action-executed="$emit('refreshTable')"
          />
        </div>
        <div class="flex flex-row align-items-center gap-3">
          <WMOwnerToggle :entity="entity" />
        </div>
      </div>
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row gap-3">
          <WMSearchBox :entity="entity" />

          <WMFilterButton
            :is-active="isFilterApplied || isFilterVisible"
            @click="openFilterSidebar"
          />
        </div>
        <div class="flex flex-row align-items-center gap-3">
          <span>{{ $t("rows-per-page") + ":" }}</span>
          <WMInput
            width="70"
            name="status"
            :highlighted="true"
            type="input-select"
            :options="listRowsPerPage"
            :value="numberOfRows"
            @update:selected-item="onChange"
          />
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
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import { computed, ref, watch } from "vue";

import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const { can } = usePermissions();
const { listRowsPerPage, selectedRowsPerPage } = useListUtils();
const { getScopes } = useActionBuilder();

// INJECT

// PROPS, EMITS
defineEmits(["new", "taskCompleted", "refreshTable"]);

const props = defineProps({
  activeButtons: Boolean,
  defaultOption: Object,
  entity: String,
});

// REFS
const numberOfRows = ref(
  listRowsPerPage.find((x) => x.value === selectedRowsPerPage.value)
);

const scopes = ref();
const selectedElements = ref([]);
const isFilterVisible = ref(false);

// COMPUTED
const isFilterApplied = computed(() => {
  if (!utilsStore.filters[props.entity]) return 0;
  return Object.keys(utilsStore.filters[props.entity]).length;
});

// COMPONENT METHODS
const onChange = (event) => {
  selectedRowsPerPage.value = event.value;
};

function closeFilterSidebar() {
  isFilterVisible.value = false;
}

function openFilterSidebar() {
  isFilterVisible.value = true;
}

getScopes(props.entity, "list").then((data) => {
  scopes.value = data;
});

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
