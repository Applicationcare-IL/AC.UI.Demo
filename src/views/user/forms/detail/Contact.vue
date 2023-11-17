<template>
  <WMDetailFormSubHeader
    @save-form="saveForm()"
    @updateEntityState="updateEntityState"
    :form-key="formKey"
  />
  <WMDetailContactForm ref="detailContactForm" :form-key="formKey" />
</template>

<script setup>
import { ref } from "vue";
import { ContactsService } from "@/service/ContactsService";

const formKey = ref("contactDetailForm");
const detailContactForm = ref(null);

const saveForm = () => {
  detailContactForm.value.onSave();
};

const updateEntityState = (id, state) => {
  console.log("updateEntityState", state);
  ContactsService.updateState(id, state);
};
</script>
