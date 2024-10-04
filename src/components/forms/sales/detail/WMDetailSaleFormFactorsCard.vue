<template>
  <Card>
    <template #title>
      <div class="w-full flex align-items-center justify-content-between">
        <span>
          {{ $t("sale.factors-in-the-organization") }}
        </span>
        <WMEditButtonIconOnly v-if="!editMode" @click="editMode = true" />
        <WMSaveButtonIconOnly
          v-else
          @click="
            emit('save');
            editMode = false;
          "
        />
      </div>
    </template>
    <template #content>
      <Skeleton v-if="loading" width="100%" height="196px" />
      <template v-else>
        <div class="flex flex-auto gap-5 flex-row">
          <div v-show="!editMode">
            <WMInput
              name="legal_adviser_info_link"
              type="info-link"
              :highlighted="true"
              :label="$t('sale.legal-adviser') + ':'"
              :value="sale.legal_adviser?.name + sale.legal_adviser?.surname"
              :to="'/contact/' + sale.legal_adviser?.id"
            />
          </div>

          <div v-show="editMode">
            <WMInput
              name="legal_adviser"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.legal-adviser') + ':'"
              :options="contacts"
              :value="selectedLegalAdviser"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>

          <div v-show="!editMode">
            <WMInput
              name="financial_guide_info_link"
              type="info-link"
              :highlighted="true"
              :label="$t('sale.financial-guide') + ':'"
              :value="sale.financial_guide?.name + sale.financial_guide?.surname"
              :to="'/contact/' + sale.financial_guide?.id"
            />
          </div>

          <div v-show="editMode">
            <WMInput
              name="financial_guide"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.financial-guide') + ':'"
              :options="contacts"
              :value="selectedFiancialGuide"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>

          <div v-show="!editFormFactors">
            <WMInput
              type="info-link"
              :highlighted="true"
              :label="$t('sale.sales-manager') + ':'"
              :value="sale.sales_manager?.name + sale.sales_manager?.surname"
              :to="'/contact/' + sale.sales_manager?.id"
            />
          </div>

          <div v-show="editFormFactors">
            <WMInput
              name="sales_manager"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.sales-manager') + ':'"
              :options="contacts"
              :value="selectedSalesManager"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>

          <div v-show="!editFormFactors">
            <WMInput
              type="info-link"
              :highlighted="true"
              :label="$t('sale.projects-manager') + ':'"
              :value="sale.project_manager?.name + sale.project_manager?.surname"
              :to="'/contact/' + sale.project_manager?.id"
            />
          </div>

          <div v-show="editFormFactors">
            <WMInput
              name="project_manager"
              :highlighted="true"
              type="input-select"
              :label="$t('sale.projects-manager') + ':'"
              :options="contacts"
              :value="selectedProjectManager"
              :placeholder="$t('select', ['contact.contact'])"
              size="sm"
            />
          </div>
        </div>
      </template>
    </template>
  </Card>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { getContactsFromApi } = useContacts();
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  sale: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["save"]);

// REFS
const editMode = ref(false);

const contacts = ref();
const selectedLegalAdviser = ref();
const selectedFiancialGuide = ref();
const selectedSalesManager = ref();
const selectedProjectManager = ref();
const loading = ref(true);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  const activeStateId = await optionSetsStore.getId("state", "active");

  const filters = {
    per_page: 99999,
    state: activeStateId,
  };

  const contactsResponse = await getContactsFromApi(filters);

  contacts.value = contactsResponse.data.map((contact) => {
    return {
      id: contact.id,
      label: `${contact.firstName} ${contact.lastName}`,
    };
  });

  loading.value = false;
};

const setSelectedFields = () => {
  selectedLegalAdviser.value = contacts.value.find(
    (contact) => contact.id === props.sale.legal_adviser?.id
  );

  selectedFiancialGuide.value = contacts.value.find(
    (contact) => contact.id === props.sale.financial_guide?.id
  );

  selectedSalesManager.value = contacts.value.find(
    (contact) => contact.id === props.sale.sales_manager?.id
  );

  selectedProjectManager.value = contacts.value.find(
    (contact) => contact.id === props.sale.project_manager?.id
  );
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  console.log(props.sale);
  await loadLazyData();
  setSelectedFields();
});
</script>

<style scoped></style>
