<template>
  <WMDetailFormSubHeader
    :form-key="formKey"
    @save-form="saveForm()"
    @deactivate-entity="handleDeactivateContact"
    @activate-entity="handleActivateContact"
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

const { activateContact, deactivateContact } = useContacts();

const handleActivateContact = (id) => {
  activateContact(id).then(() => {
    detailContactForm.value.fetchData();
  });
};

const handleDeactivateContact = (id) => {
  deactivateContact(id).then(() => {
    detailContactForm.value.fetchData();
  });
};
</script>
