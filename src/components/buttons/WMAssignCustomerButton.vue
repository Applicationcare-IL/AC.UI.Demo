<template>
  <Button label="שיוך ארגונים" icon="pi pi-briefcase" @click="toggle" />

  <OverlayPanel
    ref="isOpen"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex flex-column gap-2">
      <WMInputSearch
        name="customers"
        :placeholder="$t('select', ['customer'])"
        :multiple="true"
        width="248"
        theme="purple"
        :searchFunction="searchCustomer"
        @update:modelValue="updateSelectedCustomers"
        :new="true"
        related-sidebar="newCustomer"
        :modelValue="selectedCustomers"
      />
      <WMButton
        @click="
          emit('addCustomers', selectedCustomers);
          closeOverlay();
          clearSelectedCustomers();
        "
        class="m-1 col-6"
        name="basic-secondary"
      >
        {{ $t("buttons.assign") }}
      </WMButton>
    </div>
  </OverlayPanel>
  <WMSidebar
    :visible="isNewCustomerSidebarVisible"
    @close-sidebar="closeNewCustomerSidebar"
    @open-sidebar="openNewCustomerSidebar"
    name="newAssignCustomerButtonCustomer"
  >
    <WMNewEntityFormHeader
      entity="customer"
      name="newAssignCustomerButtonCustomer"
    />
    <WMNewCustomerForm
      :isSidebar="true"
      @close-sidebar="closeNewCustomerSidebar"
    />
  </WMSidebar>
</template>

<script setup>
import { ref } from "vue";
import { useLayout } from "@/layout/composables/layout";

const props = defineProps({
  entity: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["addCustomers"]);

const { getCustomersFromApi } = useCustomers();

const { layoutConfig } = useLayout();

const isOpen = ref();
const toggle = (event) => {
  isOpen.value.toggle(event);
};

const selectedCustomers = ref([]);

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
const isNewCustomerSidebarVisible = ref(false);

function openNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = true;
}

function closeNewCustomerSidebar() {
  isNewCustomerSidebarVisible.value = false;
}
</script>
