<template>
  <WMDetailFormSubHeader
    entity="employee"
    :form-key="formKey"
    :show-sub-bar="false"
    :has-action-builder="false"
    @save-form="saveForm()"
  />
  <WMDetailUserForm ref="detailUserForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";

useHead({
  title: "User Detail",
});

const formKey = ref("adminUserDetailForm");

const detailUserForm = ref();

const saveForm = () => {
  detailUserForm.value.onSave();
};
</script>
