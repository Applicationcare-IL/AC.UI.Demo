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
    style="width: 300px"
  >
    <div class="flex flex-column gap-2">
      <span class="h6 mb-1">{{ $t("service.what-to-link") }}</span>

      <div class="flex gap-2">
        <WMSelectableButton
          v-model="isContactsSelected"
          :label="$t('contact.contacts')"
          :unselectable="true"
          @click="
            isContactsSelected = true;
            isTeamsSelected = false;
          "
        />

        <WMSelectableButton
          v-model="isTeamsSelected"
          :label="$t('teams')"
          :unselectable="true"
          @click="
            isContactsSelected = false;
            isTeamsSelected = true;
          "
        />
      </div>

      <WMInputSearch
        v-if="isTeamsSelected"
        name="teams"
        :placeholder="$t('project.search-teams')"
        :multiple="true"
        width="248"
        :search-function="searchContact"
        :new="true"
        :model-value="selectedTeams"
        @update:model-value="onTeamSelected"
      />

      <!-- <WMInputSearch
        v-if="isContactsSelected"
        name="contact"
        :placeholder="$t('contact.search-contacts')"
        :multiple="true"
        width="248"
        :search-function="searchContact"
        :new="true"
        related-sidebar="newContactFromAssignContactButton"
        :model-value="selectedContacts"
        @update:model-value="onContactselected"
      /> -->

      <WMSearchContactsGroupedByCustomer
        v-if="isContactsSelected"
        v-model="selectedContacts"
      />

      <WMTempButton
        :text="$t('buttons.link')"
        type="type-4"
        @click="
          emit('addContacts', selectedContacts);
          closeOverlay();
          clearSelectedContacts();
        "
      />
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
const selectedTeams = ref([]);
const isNewContactSidebarVisible = ref(false);

const isTeamsSelected = ref(false);
const isContactsSelected = ref(true);

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

const onTeamSelected = (teams) => {
  selectedTeams.value = teams;
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
