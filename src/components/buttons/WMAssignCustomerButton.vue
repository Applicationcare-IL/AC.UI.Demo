<template>
  <WMButton class="m-1 col-6" name="assign-white" icon="assign" @click="toggle">
    {{ $t("buttons.link_customer") }}
  </WMButton>
  <OverlayPanel
    ref="isOpen"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
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
        class="m-1 col-6"
        name="basic-secondary"
        @click="
          emit('addCustomers', selectedCustomers);
          closeOverlay();
          clearSelectedCustomers();
        "
      >
        {{ $t("buttons.assign") }}
      </WMButton>
    </div>
  </OverlayPanel>
  <WMSidebar
    :visible="isNewCustomerSidebarVisible"
    name="newAssignCustomerButtonCustomer"
    @close-sidebar="closeNewCustomerSidebar"
    @open-sidebar="openNewCustomerSidebar"
  >
    <WMNewEntityFormHeader entity="customer" name="newCustomer" />
    <WMNewCustomerForm
      :is-sidebar="true"
      @close-sidebar="closeNewCustomerSidebar"
    />
  </WMSidebar>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { getCustomersFromApi } = useCustomers();
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

// COMPONENT METHODS
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

// WATCHERS
// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
