<template>
  <WMButton
      :text="$t('employee.unlock-user')"
      type="type-5"
      :is-disabled="isDisabled"
      :disabled="isDisabled"
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

// COMPONENT METHODS AND LOGIC
const handleUnlockUser = async () => {
  await unlockUser(props.selectedUsers[0].id).then(() => {
    emit("unlockUser");
    toast.success({title: "User unlocked", group: "br"});

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
