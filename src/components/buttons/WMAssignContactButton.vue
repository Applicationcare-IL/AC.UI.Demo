<template>
  <WMTempButton
    :text="$t('buttons.link_contact')"
    type="type-4"
    @click="toggle"
  >
    <template #customIcon>
      <div class="d-flex" v-html="PersonIcon" />
    </template>
  </WMTempButton>

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
    <template v-if="can('contacts.create')">
      <WMNewEntityFormHeader entity="contact" />
      <WMNewContactForm
        :is-sidebar="true"
        :show-confirm-dialog="false"
        @close-sidebar="closeNewContactSidebar"
        @contact-created="handleContactCreated"
      />
    </template>
    <template v-else>
      <div class="m-5">
        {{ $t("permissions.you-dont-have-permission") }}
      </div>
    </template>
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import PersonIcon from "/icons/person.svg?raw";
import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { getContactsFromApi, getContactFromApi } = useContacts();
const { layoutConfig } = useLayout();
const { can } = usePermissions();

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
// COMPONENT METHODS AND LOGIC
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
