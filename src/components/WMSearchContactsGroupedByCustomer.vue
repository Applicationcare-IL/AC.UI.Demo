<template>
  <MultiSelect
    v-model="modelValue"
    :options="groupedContacts"
    option-label="label"
    option-group-label="label"
    option-group-children="items"
    display="chip"
    :placeholder="$t('contact.search-contacts')"
    filter
    :filter-fields="['label']"
    :show-toggle-all="false"
    class="search-contact-grouped-by-customer"
  >
    <template #optiongroup="slotProps">
      <div class="flex align-items-center">
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
    <template #option="slotProps">
      <div class="flex align-items-center">
        <div>{{ removeLastPartOfLabel(slotProps.option.label) }}</div>
      </div>
    </template>
    <template v-if="props.relatedSidebar" #emptyfilter>
      <div class="flex flex-column m-2" :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''">
        <span class="vertical-align-middle"> {{ $t("no-results") }} </span>
        <a class="vertical-align-middle orange-link cursor-pointer" @click="openRelatedSidebar()">
          {{ $t("buttons.create-new-one") + " + " }}
        </a>
      </div>
    </template>
  </MultiSelect>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { layoutConfig } = useLayout();
const { getCustomersFromApi } = useCustomers();
const { openSidebar } = useSidebar();
const { optionLabelWithLang } = useLanguages();

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

const props = defineProps({
  relatedSidebar: {
    type: String,
    default: null,
  },
});

// REFS
const groupedContacts = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
let params = {
  r_small: true,
  with_contacts: true,
  per_page: 99999,
};

const mapContactsGroupedByCustomer = (customers) => {
  customers.forEach((customer) => {
    if (!customer.contacts.length) return;

    let customerObj = {
      label: customer.name,
      code: customer.id,
      items: [],
    };

    customer.contacts.forEach((contact) => {
      customerObj.items.push({
        // we need to add the customer to the label be able to filter duplicated contact.name and contact.role pairs
        label: `${contact.name} - ${contact.role[optionLabelWithLang.value]}  - ${customer.name}`,
        value: contact.id,
        telephone: contact.phone,
        contact_id: contact.id,
        ...contact,
        customer: {
          id: customer.id,
          name: customer.name,
        },
      });
    });

    groupedContacts.value.push(customerObj);
  });
};

getCustomersFromApi(params).then((data) => {
  let customers = data.data;

  mapContactsGroupedByCustomer(customers);
});

const openRelatedSidebar = () => {
  openSidebar(props.relatedSidebar);

  // hide all the active overlays
  document.querySelectorAll(".p-overlaypanel, .p-multiselect-panel").forEach((overlay) => {
    overlay.style.display = "none";
  });
};

const removeLastPartOfLabel = (label) => {
  return label.substring(0, label.lastIndexOf("-")).trim();
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style lang="scss">
.search-contact-grouped-by-customer {
  .p-multiselect .p-multiselect-label {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
  }
}

.p-multiselect-panel .p-multiselect-items .p-multiselect-item-group {
  background: var(--gray-100);
  font-weight: 700;
}
</style>
