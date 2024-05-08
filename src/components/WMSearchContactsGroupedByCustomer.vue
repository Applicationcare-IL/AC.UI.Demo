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
    :show-toggle-all="false"
    class="search-contact-grouped-by-customer"
  >
    <template #optiongroup="slotProps">
      <div class="flex align-items-center">
        <div>
          {{ slotProps.option.label }}
        </div>
      </div>
    </template>
  </MultiSelect>
</template>

<script setup>
import { ref } from "vue";

const { getCustomersFromApi } = useCustomers();

const modelValue = defineModel();

const { optionLabelWithLang } = useLanguages();

let params = {
  r_small: true,
  with_contacts: true,
};

getCustomersFromApi(params).then((data) => {
  let customers = data.data;

  mapContactsGroupedByCustomer(customers);
});

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
        label: `${contact.name} - ${contact.role[optionLabelWithLang.value]}`,
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

const groupedContacts = ref([]);
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
