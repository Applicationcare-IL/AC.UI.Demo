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
        related-sidebar="newContact"
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
    name="newContact"
    @close-sidebar="closeNewContactSidebar"
    @open-sidebar="openNewContactSidebar"
  >
    <WMNewEntityFormHeader entity="contact" name="newContact" />
    <WMNewContactForm
      :is-sidebar="true"
      @close-sidebar="closeNewContactSidebar"
    />
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { getContactsFromApi } = useContacts();
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
  isOpen.value.toggle();
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

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
