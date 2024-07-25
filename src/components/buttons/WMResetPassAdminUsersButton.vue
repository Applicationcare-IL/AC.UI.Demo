<template>
  <WMButton
      :text="'Reset password'"
      type="type-5"
      :is-disabled="isDisabled"
      :disabled="isDisabled"
      @click="handleResetPass"
  >
    <template #customIcon>
      <div class="flex" v-html="LockResetIcon" />
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import { computed } from "vue";

import LockResetIcon from "/icons/lock_reset.svg?raw";

// DEPENDENCIES
const { resetPassUsers } = useAdminUsers();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedUsers: Array,
});

const emit = defineEmits(["resetPassUser"]);

// REFS

// COMPUTED
const isDisabled = computed(() => {
  return props.selectedUsers.length === 0;
});

// COMPONENT METHODS AND LOGIC
const handleResetPass = () => {
  resetPassUsers(props.selectedUsers.map((user) => user.id)).then(() => {
    emit("resetPassUser");
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
