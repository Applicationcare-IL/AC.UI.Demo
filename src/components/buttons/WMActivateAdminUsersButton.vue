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
const toast = useToast();

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
    return props.selectedUsers.filter((user) => user.state.value === 'not_active');
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
  const selectedUsersIds = inactiveUsers.value.map((user) => user.id);
  activateUsers(selectedUsersIds).then(() => {
    emit("activateUser");
    toast.success({title: "User activated", message: "User activated successfully"});

  }).catch((error) => {
    console.error(error);
    toast.error("Error");
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
