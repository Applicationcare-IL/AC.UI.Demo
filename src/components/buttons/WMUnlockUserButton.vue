<template>
  <WMButton
      :text="'Unlock'"
      type="type-5"
      :is-disabled="isDisabled"
      :disabled="isDisabled"
      @click="handleUnlockUsers"
  >
    <template #customIcon>
      <div class="flex" v-html="unlockUserIcon" />
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import unlockUserIcon from "/icons/activate_user.svg?raw";
import useAdminUsers from "@/composables/useAdminUsers";

// DEPENDENCIES
const { unlockUser } = useAdminUsers();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedUsers: Array,
});

const emit = defineEmits(["unlockUser"]);

// REFS
const isDisabled = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const handleUnlockUsers = () => {
    unlockUser(props.selectedUsers.map((user) => user.id)).then(() => {
      emit("unlockUser");
    });
};

const load = () => {
  isDisabled.value = props.selectedUsers[0].active === 0;
}

load();

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
