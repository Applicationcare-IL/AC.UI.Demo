<template>
  <WMButton :text="$t('buttons.link_customer')" type="primary" @click="toggle">
    <template #customIcon>
      <div class="flex" v-html="WorkIcon" />
    </template>
  </WMButton>

  <OverlayPanel ref="isOpen" :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
    <div class="flex flex-column gap-2">
      <WMInputSearch
        name="assignCustomer"
        :placeholder="$t('select', ['customer'])"
        :multiple="true"
        width="248"
        theme="purple"
        :new="true"
        related-sidebar="newAssignCustomerButtonCustomer"
        :search-function="searchCustomer"
        :model-value="selectedCustomers"
        @update:model-value="updateSelectedCustomers"
      />

      <WMButton
        class="mt-2"
        :text="$t('buttons.assign')"
        type="primary"
        @click="
          emit('addCustomers', selectedCustomers);
          closeOverlay();
          clearSelectedCustomers();
        "
      />
    </div>
  </OverlayPanel>
  <WMSidebar
    :visible="isNewCustomerSidebarVisible"
    name="newAssignCustomerButtonCustomer"
    data-testid="new_form"
    @close-sidebar="closeNewCustomerSidebar"
    @open-sidebar="openNewCustomerSidebar"
  >
    <WMNewEntityFormHeader entity="customer" name="newCustomer" />
    <WMNewCustomerForm
      :is-sidebar="true"
      :show-confirm-dialog="false"
      @close-sidebar="closeNewCustomerSidebar"
      @customer-created="handleCustomerCreated"
    />
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import WorkIcon from "/icons/work.svg?raw";
import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { getCustomersFromApi, getCustomerFromApi } = useCustomers();
const { layoutConfig } = useLayout();

// PROPS, EMITS
defineProps({
  entity: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["addCustomers"]);

// REFS
const selectedCustomers = ref([]);
const isOpen = ref();
const isNewCustomerSidebarVisible = ref(false);

// COMPONENT METHODS AND LOGIC
const toggle = (event) => {
  isOpen.value.toggle(event);
};

const searchCustomer = (query) => {
  return getCustomersFromApi({ search: query });
};

const updateSelectedCustomers = (customers) => {
  selectedCustomers.value = customers;
};

const closeOverlay = () => {
  isOpen.value.toggle();
};

const clearSelectedCustomers = () => {
  selectedCustomers.value = [];
};

// new customer sidebar
function openNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = true;
}

function closeNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = false;
}

/**
 * When we create a new customer using the new customer form in a sidebar, we need to
 * add it to the list of the customers that uses the WMAssignCustomerButton and
 * close the new form sidebar, so we manage it here by emitting the event "addCustomers" and
 * closing the sidebar directly from this component
 * @param {*} customerId
 */
function handleCustomerCreated(customerId) {
  if (!customerId) {
    return;
  }

  getCustomerFromApi(customerId).then((response) => {
    selectedCustomers.value.push(response);

    emit("addCustomers", selectedCustomers.value);
    closeNewCustomerSidebar();
    clearSelectedCustomers();
  });
}

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
