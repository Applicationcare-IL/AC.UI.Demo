<template>
  <WMButton
      :text="$t('employee.unlock-user')"
      type="type-5"
      :is-disabled="false"
      :disabled="false"
      @click="handleUnlockUser"
  >
    <template #customIcon>
      <div class="flex" v-html="ActivateUserIcon"/>
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import ActivateUserIcon from "/icons/activate_user.svg?raw";

// DEPENDENCIES
const {unlockUser} = useAdminUsers()

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedUsers: Array,
});

const emit = defineEmits(["unlockUser"]);

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleUnlockUser = async () => {
  await unlockUser(props.selectedUsers).then(() => {
    emit("unlockUser");
  });
}

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
