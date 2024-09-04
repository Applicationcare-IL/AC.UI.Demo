<template>
  <WMButton
      :text="$t('employee.unlock-user')"
      type="type-5"
      :is-disabled="isDisabled"
      :disabled="isDisabled"
      @click="handleUnlockUser"
  >
    <template #customIcon>
      <div class="flex" v-html="UnlockUserIcon"/>
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import {computed} from "vue";

import UnlockUserIcon from "/icons/lock_open.svg?raw";

// DEPENDENCIES
const {unlockUser} = useAdminUsers()
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedUsers: Array,
  isDisabled: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["unlockUser"]);

// REFS

// COMPUTED
const inactiveUsers = computed(() => {
  if (props.selectedUsers) {
    return props.selectedUsers.filter((user) => user.locked != null);
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
const handleUnlockUser = () => {
  const selectedUsersIds = inactiveUsers.value.map((user) => user.id);
  unlockUser(selectedUsersIds).then(() => {
    emit("unlockUser");
    toast.success({title: "User unlocked", group: "bl"});

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
