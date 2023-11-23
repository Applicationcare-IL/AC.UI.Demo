<template>
  <WMButton @click="toggle" class="m-1 col-6" name="assign-white" icon="assign">
    שיוך אנשי קשר
  </WMButton>
  <OverlayPanel
    ref="isOpen"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-column gap-2">
      <WMInputSearch
        name="employeeOrTeam"
        :placeholder="$t('select', ['contact'])"
        type="input-search"
        :multiple="false"
        width="248"
        :searchFunction="searchContact"
        @change="onContactselected"
        :new="true"
        related-sidebar="newContact"
      />
      <WMButton
        @click="emit('contactSelected', selectedContact)"
        class="m-1 col-6"
        name="basic-secondary"
        >הקצה
      </WMButton>
    </div>
  </OverlayPanel>

  <WMButton
    @click="emit('contactSelected', selectedContact)"
    class="m-1 col-6"
    name="basic-secondary"
    >הקצה
  </WMButton>
  <WMSidebar
    :visible="isNewContactSidebarVisible"
    @close-sidebar="closeNewContactSidebar"
    @open-sidebar="openNewContactSidebar"
    name="newContact"
  >
    <WMNewEntityFormHeader entity="contact" name="newContact" />
    <WMNewContactForm
      :isSidebar="true"
      @close-sidebar="closeNewContactSidebar"
    />
  </WMSidebar>
</template>

<script setup>
import { ref } from "vue";
import { useLayout } from "@/layout/composables/layout";
import { useContactsStore } from "@/stores/contactsStore";

const props = defineProps({
  entity: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["contactSelected", "closeSidebar"]);

const { getContactsFromApi } = useContacts();

const { layoutConfig } = useLayout();

const isOpen = ref();
const toggle = (event) => {
  isOpen.value.toggle(event);
};

const selectedContact = ref();

const searchContact = (query) => {
  return getContactsFromApi({ search: query });
};

const onContactselected = (contact) => {
  console.log(contact);
  selectedContact.value = contact.value;
};

// new contact sidebar
const isNewContactSidebarVisible = ref(false);

function openNewContactSidebar() {
  isNewContactSidebarVisible.value = true;
}

function closeNewContactSidebar() {
  isNewContactSidebarVisible.value = false;
}
</script>
