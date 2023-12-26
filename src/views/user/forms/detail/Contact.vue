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

useHead({
  title: "Contact Detail",
});

const formKey = ref("contactDetailForm");
const detailContactForm = ref(null);

const saveForm = () => {
  detailContactForm.value.onSave();
};

const { updateState } = useContacts();

const updateEntityState = (id, state) => {
  updateState(id, state);
};
</script>
