<template>
  <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
    <ProgressSpinner />
  </div>
  <div v-else class="wm-new-form-container flex flex-auto flex-column overflow-auto gap-5">
    <div class="task-data flex flex-column gap-5">
      <h3 class="h3 mb-0">{{ $t("general-details") }}</h3>
      <div class="flex flex-row gap-5">
        <WMInput
          name="owner"
          type="info"
          :highlighted="true"
          :label="$t('owner') + ':'"
          :value="'pepito'"
        />
        <pre>{{ values }}</pre>
      </div>
      <div class="flex flex-row gap-5">
        <WMInput
          name="customer"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.customer') + ':'"
          :options="customers"
          :placeholder="$t('select', ['sale.customer'])"
          size="sm"
          required
        />
        <WMInput
          name="initiator"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.initiator') + ':'"
          :options="initiators"
          :placeholder="$t('select', ['sale.initiator'])"
          size="sm"
          option-set
          required
        />
        <WMInput
          name="sale_type"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.sale-type') + ':'"
          :options="sales"
          :placeholder="$t('select', ['sale.sale-type'])"
          size="sm"
          option-set
          required
        />
        <WMInput
          name="source"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.source') + ':'"
          :options="sources"
          :placeholder="$t('select', ['sale.source'])"
          size="sm"
          option-set
          required
        />
      </div>
    </div>

    <Divider />

    <WMToggleSwitch v-model="isRecurring" :label="$t('sale.tender')">
      <div class="flex flex-column gap-5">
        <div class="flex flex-row gap-5">
          <WMInput
            name="publication_date"
            :highlighted="true"
            type="date"
            :label="$t('sale.publication-date') + ':'"
            size="sm"
          />
          <WMInput
            name="question_date"
            :highlighted="true"
            type="date"
            :label="$t('sale.question-date') + ':'"
            size="sm"
          />
          <WMInput
            name="response_date"
            :highlighted="true"
            type="date"
            :label="$t('sale.response-date') + ':'"
            size="sm"
          />
        </div>
        <div class="flex flex-row gap-5">
          <WMInput
            name="resolution_date"
            :highlighted="true"
            type="date"
            :label="$t('sale.resolution-date') + ':'"
            size="sm"
          />
          <WMInput
            name="supply-date"
            :highlighted="true"
            type="date"
            :label="$t('sale.supply-date') + ':'"
            size="sm"
          />
        </div>
      </div>
    </WMToggleSwitch>

    <Divider />

    <h3 class="h3 mt-0">{{ $t("sale.factors-in-the-organization") }}</h3>
    <div class="flex flex-row gap-5">
      <WMInput
        name="legal_adviser"
        :highlighted="true"
        type="input-select"
        :label="$t('sale.legal-adviser') + ':'"
        :options="contacts"
        :placeholder="$t('select', ['contact.contact'])"
        size="sm"
      />
      <WMInput
        name="financial_guide"
        :highlighted="true"
        type="input-select"
        :label="$t('sale.financial-guide') + ':'"
        :options="contacts"
        :placeholder="$t('select', ['contact.contact'])"
        size="sm"
      />
      <WMInput
        name="sales_manager"
        :highlighted="true"
        type="input-select"
        :label="$t('sale.sales-manager') + ':'"
        :options="contacts"
        :placeholder="$t('select', ['contact.contact'])"
        size="sm"
      />
      <WMInput
        name="projects_manager"
        :highlighted="true"
        type="input-select"
        :label="$t('sale.projects-manager') + ':'"
        :options="contacts"
        :placeholder="$t('select', ['contact.contact'])"
        size="sm"
      />
    </div>

    <Divider />

    <Divider />

    <h3 class="h3 mt-0">{{ $t("sale.customers-details") }}</h3>
    <div class="flex flex-column gap-5">
      <div class="flex flex-row gap-5">
        <WMInput
          name="customer_consultant"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.customer-consultant') + ':'"
          :options="contacts"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
        />
        <WMInput
          name="information_technology"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.information-technology') + ':'"
          :options="contacts"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
        />
        <WMInput
          name="business_manager"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.business-manager') + ':'"
          :options="contacts"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
        />
        <WMInput
          name="decision_maker"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.decision-maker') + ':'"
          :options="contacts"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
        />
      </div>
      <div class="flex flex-row gap-5">
        <WMInput
          name="budgeting_factor"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.budgeting-factor') + ':'"
          :options="contacts"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
        />
        <WMInput
          name="budget"
          :highlighted="true"
          type="input-number"
          :label="$t('sale.budget') + ':'"
          size="sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const { getContactsFromApi } = useContacts();
const { getCustomersFromApi } = useCustomers();
const { createSale } = useSales();

const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const toast = useToast();
const dialog = useDialog();

// INJECT

// PROPS, EMITS
const emit = defineEmits(["newSaleCreated"]);

// REFS
const loading = ref(true);

const customers = ref();
const initiators = ref();
const sales = ref();
const sources = ref();
const contacts = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, values, resetForm, meta } = useForm({
  validationSchema: formUtilsStore.getNewSalesFormValidationSchema,
});

const onSubmit = handleSubmit(async () => {
  try {
    const data = await createSale(values);

    emit("newSaleCreated");
    dialog.confirmNewAdminMessage({ id: data.data.id, emit });

    resetForm();

    toast.success({ title: "Sale created", message: "sale created successfully" });
  } catch (error) {
    console.error(error);
  }
});

const loadLazyData = async () => {
  const activeStateId = await optionSetsStore.getId("state", "active");

  const filters = {
    per_page: 99999,
    state: activeStateId,
  };

  const response2 = await getCustomersFromApi(filters);

  customers.value = response2.data.map((customer) => {
    return {
      id: customer.id,
      label: customer.name,
    };
  });

  initiators.value = await optionSetsStore.getOptionSetValues("sales_initiator");
  sales.value = await optionSetsStore.getOptionSetValues("sales_type");
  sources.value = await optionSetsStore.getOptionSetValues("sales_source");

  const response = await getContactsFromApi(filters);

  contacts.value = response.data.map((contact) => {
    return {
      id: contact.id,
      label: contact.firstName,
    };
  });

  loading.value = false;
};

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>

<style scoped></style>
