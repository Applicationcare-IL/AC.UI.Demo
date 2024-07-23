<template>
  <WMDetailFormSubHeader
    entity="team"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  />
  <WMDetailTeamForm ref="detailTeamForm" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminTeamDetailForm");
const detailTeamForm = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  detailTeamForm.value.onSave();
};

// const refreshTable = () => {
//   detailUserForm.value.fetchData();
// };

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)

useHead({
  title: "Team Detail",
});
</script>







