<template>
  <h2 class="h2 mb-0">TEAM</h2>
  <div class="wm-form-row gap-5">
    <WMInputSearch
      name="contact"
      :required="true"
      :placeholder="$t('select', ['contact'])"
      type="table"
      :label="$t('contact') + ':'"
      width="160"
      :highlighted="true"
      :searchFunction="searchContact"
      :new="true"
      related-sidebar="newCustomer"
      @change="onContactselected"
      :multiple="true"
    />
  </div>
  <div class="wm-form-row gap-5">
    <WMContactsTable
      :contacts="selectedContacts"
      :columns="getSelectedContactsForNewCustomerColumns()"
      :showControls="false"
      @update:role="updatedRole"
      @update:mainContact="updatedMainContact"
      @unlink="unlinkContact"
      :multiselect="false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();
const { getContactsFromApi } = useContacts();

const searchContact = (query) => {
  return getContactsFromApi({
    search: query,
  });
};

const defaultRole = optionSetsStore.optionSets["contact_customer_role"].find(
  (role) => role.value === "employee"
);

const { getSelectedContactsForNewCustomerColumns } = useListUtils();

const selectedContacts = ref([]);
const updatedMainContact = (id) => {
  selectedContacts.value.map((contact) => {
    if (contact.id === id) {
      contact.main = true;
    } else {
      contact.main = false;
    }
  });
};

const unlinkContact = (id) => {
  console.log("UNLINK CONTACT" + id);
  const index = selectedContacts.value.findIndex((contact) => {
    return contact.contact_id == id;
  });
  selectedContacts.value.splice(index, 1);
};

const onContactselected = (newContact) => {
  if (
    selectedContacts.value.some((contact) => contact.id === newContact.value.id)
  )
    return;

  //Select the default role for the new contact and add it to the list of selected contacts
  newContact.value.role = defaultRole;
  selectedContacts.value.push(newContact.value);
};
</script>

<style scoped lang="scss"></style>
