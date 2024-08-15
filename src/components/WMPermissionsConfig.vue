<template>
  <div class="flex flex-row flex-wrap flex-column mb-5">
    <div class="flex gap-5 align-items-center mb-3">
      <p class="h2 mb-0">{{ $t("permissions.entity-permissions") }}</p>
      <div class="flex gap-2 align-items-center">
        <WMButton
          v-if="entityType === 'user'"
          :text="$t('permissions.reset-permissions')"
          type="link"
          class="px-0"
          :disabled="true"
          :is-disabled="true"
          @click="handleResetPermissions"
        />
        <div
          v-tooltip.bottom="$t('permissions.reset-entity-permissions-text')"
          class="flex"
          v-html="HelpIcon"
        />
      </div>
    </div>
    <WMEntityPermissionsTable :permissions="permissions.entities" />
  </div>
  <div class="flex flex-row flex-wrap flex-column">
    <div class="flex gap-3 align-items-center mb-3">
      <p class="h2 mb-0">{{ $t("permissions.general-permissions") }}</p>
      <div class="flex gap-2 align-items-center">
        <WMButton
          v-if="entityType === 'user'"
          :text="$t('permissions.reset-permissions')"
          type="link"
          class="px-0"
          :disabled="true"
          :is-disabled="true"
          @click="handleResetPermissions"
        />
        <div
          v-tooltip.bottom="$t('permissions.reset-general-permissions-text')"
          class="flex"
          v-html="HelpIcon"
        />
      </div>
    </div>
    <div class="flex gap-5">
      <div class="flex flex-column gap-5 flex-1">
        <WMPermissionSection title="Dashboard">
          <template #custom-content>
            <WMEntityPermissionsDashboardSelector :permissions="permissions.dashboard" />
          </template>
        </WMPermissionSection>
        <WMPermissionSection title="Admin permissions" :permissions="permissions.admin" />
        <WMPermissionSection
          title="Actions"
          :permissions="permissions.actions"
          clear-all
          select-all
        />
      </div>
      <div class="flex flex-column gap-5 flex-1">
        <WMPermissionSection
          title="Sale discounts"
          :permissions="permissions.sale_discounts"
          clear-all
          select-all
        />
        <WMPermissionSection
          title="Documents types"
          :permissions="permissions.document_types"
          clear-all
          select-all
        />
      </div>
      <div class="flex flex-column gap-5 flex-1">
        <WMPermissionSection
          title="Service areas"
          :permissions="permissions.service_area"
          clear-all
          select-all
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { watch } from "vue";

import HelpIcon from "/icons/help.svg?raw";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
const props = defineProps({
  permissions: {
    type: Object,
    required: true,
  },
  entityType: {
    type: String,
  },
});

const emit = defineEmits(["permissions-changed"]);
// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleResetPermissions = () => {
  console.log("reset permissions");
};

// PROVIDE, EXPOSE

// WATCHERS
watch(
  props.permissions,
  (value) => {
    emit("permissions-changed", value);
  },
  {
    deep: true,
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
