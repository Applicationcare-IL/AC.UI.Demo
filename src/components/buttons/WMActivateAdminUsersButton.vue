<template>
  <WMButton
    :text="'Activate'"
    type="type-5"
    :is-disabled="isDisabled"
    :disabled="isDisabled"
    @click="handleActivateUsers"
  >
    <template #customIcon>
      <div class="flex" v-html="ActivateUserIcon" />
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import { computed } from "vue";

import ActivateUserIcon from "/icons/activate_user.svg?raw";

// DEPENDENCIES
const { activateUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedUsers: Array,
});

const emit = defineEmits(["activateUser"]);

// REFS

// COMPUTED
const inactiveUsers = computed(() => {
  if (props.selectedUsers) {
    return props.selectedUsers.filter((user) => user.active === 0);
  }

  return [];
});

const isDisabled = computed(() => {
  if (props.selectedUsers.length === 0) {
    return true;
  }

  if (inactiveUsers.value.length > 0) {
    return false;
  }

  return true;
});

// COMPONENT METHODS AND LOGIC
const handleActivateUsers = () => {
  const inactiveUsers = props.selectedUsers.filter((user) => user.active === 0);
  const selectedUsersIds = inactiveUsers.map((user) => user.id);
  activateUsers(selectedUsersIds).then(() => {
    emit("activateUser");
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
