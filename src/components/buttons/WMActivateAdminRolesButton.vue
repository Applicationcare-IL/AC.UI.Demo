<template>
  <WMButton
      :text="'Activate'"
      type="type-5"
      :is-disabled="isDisabled"
      :disabled="isDisabled"
      @click="handleActivateRoles"
  >
    <template #customIcon>
      <div class="flex" v-html="ActivateRoleIcon" />
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import { computed } from "vue";

import ActivateRoleIcon from "/icons/activate_user.svg?raw";
import useAdminRoles from "@/composables/useAdminRoles";

// DEPENDENCIES
const { activateRoles } = useAdminRoles();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedRoles: Array,
});

const emit = defineEmits(["activateRole"]);

// REFS

// COMPUTED
const inactiveRoles = computed(() => {
  if (props.selectedRoles) {
    return props.selectedRoles.filter((role) => role.state.value === 'not_active');
  }

  return [];
});

const isDisabled = computed(() => {
  if (props.selectedRoles.length === 0) {
    return true;
  }

  if (inactiveRoles.value.length > 0) {
    return false;
  }

  return true;
});

// COMPONENT METHODS AND LOGIC
const handleActivateRoles = () => {
  const inactiveRoles = props.selectedRoles.filter((role) => role.state.value === 'not_active');
  const selectedRolesIds = inactiveRoles.map((role) => role.id);
  activateRoles(selectedRolesIds).then(() => {
    emit("activateRole");
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
