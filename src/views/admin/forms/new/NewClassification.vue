<template>
  <WMNewFormSubHeader @save-form="saveForm()" @cancel-form="cancelForm()"/>
  <WMNewClassificationForm ref="newAdminClassificationForm"/>
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
const newAdminClassificationForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  newAdminClassificationForm.value.onSubmit();
};

const cancelForm = () => {
  router.push({name: "adminClassifications"});
};
</script>
