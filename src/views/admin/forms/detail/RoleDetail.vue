<template>
  <WMDetailFormSubHeader
      entity="role"
      :form-key="formKey"
      :has-action-builder="false"
      :show-message-button="false"
      :show-email-button="false"
      @save-form="saveForm()"
  />
  <WMDetailRoleForm ref="detailRoleForm" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import {ref} from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS
const detailRoleForm = ref();
const formKey = ref("adminRoleDetailForm");

// COMPUTED

// COMPONENT METHODS AND LOGIC
useHead({
  title: "Role Detail",
});

const saveForm = () => {
  detailRoleForm.value.onSave();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
