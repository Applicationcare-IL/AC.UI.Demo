<template>
  <WMButton
      :text="$t('employee.reset-pass')"
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

const toast = useToast();

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
    toast.success({title: "Password reset", message: "A reset email was send to the user"});

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
