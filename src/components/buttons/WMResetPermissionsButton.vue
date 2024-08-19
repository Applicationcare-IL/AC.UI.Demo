<template>
  <div class="flex gap-2 align-items-center">
    <WMButton
      :text="$t('permissions.reset-permissions')"
      type="link"
      class="px-0"
      :disabled="!arePermissionsModified"
      :is-disabled="!arePermissionsModified"
      @click="type === 'entity' ? handleResetEntityPermissions() : handleResetGeneralPermissions()"
    />
    <div
      v-tooltip.bottom="$t('permissions.reset-entity-permissions-text')"
      class="flex"
      v-html="HelpIcon"
    />
  </div>
</template>

<script setup>
// IMPORTS
import { computed } from "vue";

import HelpIcon from "/icons/help.svg?raw";

// DEPENDENCIES
const { resetEntityPermissions, resetGeneralPermissions } = useAdminPermissions();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  permissions: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  entityId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["permissionsChanged"]);

// REFS

// COMPUTED
const arePermissionsModified = computed(() => {
  return checkIfPermissionIsModified(props.permissions);
});

// COMPONENT METHODS AND LOGIC
const handleResetEntityPermissions = () => {
  resetEntityPermissions("employee", props.entityId)
    .then(() => {
      emit("permissionsChanged");
      toast.success({ message: "Entity permissions reset successfully" });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error resetting entity permissions");
    });
};

const handleResetGeneralPermissions = () => {
  resetGeneralPermissions("employee", props.entityId)
    .then(() => {
      emit("permissionsChanged");
      toast.success({ message: "General permissions reset successfully" });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error resetting general permissions");
    });
};

const checkIfPermissionIsModified = (permissions) => {
  for (const key in permissions) {
    if (permissions[key].disabled === false && permissions[key].value) {
      return true;
    }
    if (typeof permissions[key] === "object") {
      if (checkIfPermissionIsModified(permissions[key])) {
        return true;
      }
    }
  }
  return false;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
