<template>
  <WMButton
      :text="'Activate'"
      type="type-5"
      :is-disabled="isDisabled"
      :disabled="isDisabled"
      @click="handleActivateQuickCodes"
  >
    <template #customIcon>
      <div class="flex" v-html="ActivateQuickCodes"/>
    </template>
  </WMButton>
</template>

<script setup>
// IMPORTS
import {computed} from "vue";

import ActivateQuickCodes from "/icons/activate_user.svg?raw";

// DEPENDENCIES
const {activateQuickCodes} = useAdminQuickCodes();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  selectedQuickCodes: {
    type: Array,
    default: () => [],
  },

});

const emit = defineEmits(["activateQuickCode"]);

// REFS

// COMPUTED
const inactiveQuickCodes = computed(() => {
  if (props.selectedQuickCodes) {
    return props.selectedQuickCodes.filter((quickCode) => quickCode.state.value === 'not_active');
  }

  return [];
});

const isDisabled = computed(() => {
  if (props.selectedQuickCodes.length === 0) {
    return true;
  }

  if (inactiveQuickCodes.value.length > 0) {
    return false;
  }

  return true;
});

// COMPONENT METHODS AND LOGIC
const handleActivateQuickCodes = () => {
  const selectedQuickCodeIds = inactiveQuickCodes.value.map((quickCode) => quickCode.id);
  activateQuickCodes(selectedQuickCodeIds).then(() => {
    emit("activateQuickCode");
    toast.success({title: "Quick Code activated", message: "Quick Code activated successfully", group: "bl"});
  }).catch((error) => {
    console.error(error);
    toast.error("error");
  });
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
