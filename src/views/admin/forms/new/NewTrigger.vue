<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()"/>
  <WMNewTriggerForm ref="newAdminTriggerForm"/>
</template>

<script setup>
// IMPORTS
import {ref} from "vue";
import {useRouter} from "vue-router";

// DEPENDENCIES
const router = useRouter();

// INJECT

// PROPS, EMITS

// REFS
const newAdminTriggerForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  newAdminTriggerForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({name: "adminTriggers"});
};
</script>
