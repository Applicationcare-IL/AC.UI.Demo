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
        :multiple="true"
        width="248"
        :searchFunction="searchContact"
        @update:modelValue="onContactselected"
        :new="true"
        related-sidebar="newContact"
        :modelValue="selectedContacts"
      />
      <WMButton
        @click="
          emit('addContacts', selectedContacts);
          closeOverlay();
          clearSelectedContacts();
        "
        class="m-1 col-6"
        name="basic-secondary"
      >
        הקצה
      </WMButton>
    </div>
  </OverlayPanel>
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

const selectedContacts = ref([]);

const searchContact = (query) => {
  return getContactsFromApi({ search: query });
};

const onContactselected = (contacts) => {
  selectedContacts.value = contacts;
};

const closeOverlay = () => {
  isOpen.value.toggle();
};

const clearSelectedContacts = () => {
  selectedContacts.value = [];
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
