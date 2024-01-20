<template>
  <WMButton class="m-1 col-6" name="assign-white" icon="assign" @click="toggle">
    {{ $t("buttons.link_contact") }}
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
        :search-function="searchContact"
        :new="true"
        related-sidebar="newContactFromAssignContactButton"
        :model-value="selectedContacts"
        @update:model-value="onContactselected"
      />
      <WMButton
        class="m-1 col-6"
        name="basic-secondary"
        @click="
          emit('addContacts', selectedContacts);
          closeOverlay();
          clearSelectedContacts();
        "
      >
        {{ $t("buttons.assign") }}
      </WMButton>
    </div>
  </OverlayPanel>

  <WMSidebar
    :visible="isNewContactSidebarVisible"
    name="newContactFromAssignContactButton"
    @close-sidebar="closeNewContactSidebar"
    @open-sidebar="openNewContactSidebar"
  >
    <WMNewEntityFormHeader entity="contact" />
    <WMNewContactForm
      :is-sidebar="true"
      :show-confirm-dialog="false"
      @close-sidebar="closeNewContactSidebar"
      @contact-created="handleContactCreated"
    />
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { getContactsFromApi, getContactFromApi } = useContacts();
const { layoutConfig } = useLayout();

// PROPS, EMITS
defineProps({
  entity: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["addContacts", "contactSelected", "closeSidebar"]);

// REFS
const isOpen = ref();
const selectedContacts = ref([]);
const isNewContactSidebarVisible = ref(false);

// COMPUTED
// COMPONENT METHODS
const toggle = (event) => {
  isOpen.value.toggle(event);
};

const searchContact = (query) => {
  return getContactsFromApi({ search: query });
};

const onContactselected = (contacts) => {
  selectedContacts.value = contacts;
};

const closeOverlay = () => {
  isOpen.value.hide();
};

const clearSelectedContacts = () => {
  selectedContacts.value = [];
};

// new contact sidebar
function openNewContactSidebar() {
  isNewContactSidebarVisible.value = true;
}

function closeNewContactSidebar() {
  isNewContactSidebarVisible.value = false;
}

/**
 * When we create a new contact using the new contact form in a sidebar, we need to
 * add it to the list of the contacts that uses the WMAssignContactButton and
 * close the new form sidebar, so we manage it here by emitting the event "addContacts" and
 * closing the sidebar directly from this component
 * @param {*} contactId
 */
function handleContactCreated(contactId) {
  if (!contactId) {
    return;
  }

  getContactFromApi(contactId).then((response) => {
    selectedContacts.value.push(response);

    emit("addContacts", selectedContacts.value);
    closeNewContactSidebar();
    clearSelectedContacts();
  });
}

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
