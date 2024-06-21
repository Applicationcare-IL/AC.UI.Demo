<template>
  <div v-if="loaded" class="wm-detail-form-container pt-5 flex flex-auto flex-column overflow-auto">
    <div class="customer-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="owner"
                    type="info"
                    :highlighted="true"
                    :label="$t('owner') + ':'"
                    :value="customer.owner.name"
                  />
                  <WMInput
                    name="system_id"
                    type="info"
                    :highlighted="true"
                    :label="$t('customer.system-id') + ':'"
                    :value="customer.id"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('customer.name') + ':'"
                    :value="customer.name"
                    width="150"
                    required
                  />
                  <WMInput
                    name="number"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('customer.customer-number') + ':'"
                    :value="customer.number"
                    width="150"
                    required
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="type"
                    :highlighted="true"
                    type="input-select"
                    :label="$t('type') + ':'"
                    :options="types"
                    width="80"
                    :value="selectedType"
                    option-set
                  />
                  <WMInput
                    name="rating"
                    :highlighted="true"
                    type="input-select"
                    :label="$t('customer.rating') + ':'"
                    :options="ratings"
                    :value="selectedRating"
                    width="80"
                    option-set
                  />
                  <WMInput
                    name="is_provider"
                    type="input-select-button"
                    :highlighted="true"
                    :label="$t('customer.is-provider') + ':'"
                    :options="yesNoOptions"
                    :value="isProvider"
                    width="80"
                    @update:selected-item="onProviderChanged"
                  />
                </div>
                <div v-if="isProvider.value" class="wm-form-row gap-5">
                  <WMInput
                    name="basic_term"
                    type="input-select"
                    :highlighted="true"
                    :label="$t('customer.basic_term') + ':'"
                    :options="basicTerms"
                    :value="selectedTerm"
                    width="80"
                    option-set
                  />

                  <WMInput
                    name="calculate_term"
                    type="input-text"
                    :highlighted="true"
                    :value="customer.calculate_term"
                    :label="$t('customer.calculate_term') + ':'"
                  />
                </div>
                <div class="wm-form-row mt-5">
                  <p class="p-card-title mb-0">
                    {{ $t("communication-details") }}
                  </p>
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="phone"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('telephone') + ':'"
                    :value="customer.phone"
                    required
                  />
                  <WMInput
                    name="fax"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('fax') + ':'"
                    :value="customer.fax"
                  />
                </div>
                <div class="wm-form-row">
                  <WMInput
                    name="email"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('email') + ':'"
                    :value="customer.email"
                    required
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <WMDetailFormLocation :location="customer.location" editable />
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("customer.areas") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <WMInputSearch
                  name="service_area"
                  :placeholder="$t('select', ['customer.area'])"
                  :required="true"
                  :multiple="true"
                  width="248"
                  :options="service_areas"
                  :highlighted="true"
                  :model-value="selectedServiceAreas"
                  :option-set="true"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t("customer.notes") }} </template>
            <template #content>
              <div class="contact-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    id="notes"
                    type="text-area"
                    name="notes"
                    :value="customer.notes"
                    width="full"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title> {{ $t("service.open") }} : {{ customer.open_services }} </template>

            <template #content>
              <div class="flex flex-column gap-3 font-bold">
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-green-200 text-green-900"
                >
                  <span class="font-size-20">{{ $t("sla.no_breach") }}</span>
                  <span class="font-size-24">
                    {{ customer.open_services - customer.breached_services }}
                  </span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-gray-100 text-gray-900"
                >
                  <span class="font-size-20">{{ $t("sla.breached") }}</span>
                  <span class="font-size-24">{{ customer.breached_services }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title> {{ $t("task.open") }} : {{ customer.open_tasks }}</template>
            <template #content>
              <div class="flex flex-column gap-3 font-bold">
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-green-200 text-green-900"
                >
                  <span class="font-size-20">{{ $t("sla.no_breach") }}</span>
                  <span class="font-size-24">{{
                    customer.open_tasks - customer.breached_tasks
                  }}</span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-red-100 text-red-700"
                >
                  <span class="font-size-20">{{ $t("sla.breached") }}</span>
                  <span class="font-size-24">
                    {{ customer.breached_tasks }}
                  </span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <Accordion v-if="can('contacts.read')" data-testid="contacts-accordion">
        <AccordionTab :header="$t('contact.contacts')">
          <WMContactsTable
            v-if="can('contacts.read')"
            :columns="contactColumns"
            :customer-id="route.params.id"
            :show-title="false"
          />
        </AccordionTab>
      </Accordion>

      <Accordion
        v-if="checkIfEntityIsActive('services') && can('services.read')"
        data-testid="services-accordion"
      >
        <AccordionTab :header="$t('service.services')">
          <WMServicesTable
            related-entity="customer"
            :related-entity-id="customer.id"
            :columns="serviceColumns"
            multiselect
            :hide-title="true"
          />
        </AccordionTab>
      </Accordion>

      <Accordion
        v-if="can('tasks.read') && checkIfEntityIsActive('tasks')"
        data-testid="tasks-accordion"
      >
        <AccordionTab :header="$t('task.tasks')">
          <WMTasksTable
            related-entity="customer"
            :related-entity-id="customer.id"
            :columns="taskColumns"
            multiselect
            :hide-title="true"
          />
        </AccordionTab>
      </Accordion>

      <Accordion
        v-if="can('projects.read') && checkIfEntityIsActive('projects')"
        data-testid="projects-accordion"
      >
        <AccordionTab :header="$t('project.projects')">
          <WMProjectsTable
            related-entity="customer"
            :related-entity-id="customer.id"
            :multiselect="false"
            :show-header-options="false"
            :hide-title="true"
          />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('budget.payments')" data-testid="payments-accordion">
          <WMPaymentsTable
            :project-id="projectId"
            related-entity="customer"
            :related-entity-id="route.params.id"
            :read-only="true"
            :columns="getCustomerPaymentsColumns()"
          />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('documents.documents')" data-testid="documents-accordion">
          <WMDocumentsTable
            :columns="documentsColumns"
            :related-entity-id="customer.id"
            related-entity="customer"
            :show-header-options="true"
            :hide-title="true"
          />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('asset.assets')" data-testid="assets-accordion">
          <WMAssetsTable
            :columns="assetColumns"
            related-entity="customer"
            :related-entity-id="route.params.id"
            :multiselect="true"
            :hide-title="true"
          />
        </AccordionTab>
      </Accordion>

      <div class="flex flex-row gap-5 flex-wrap mt-5 pt-5">
        <div class="flex-1 card-container">
          <Card>
            <template #title>
              <div class="h1 mx-5 mt-5">קבצים מצורפים</div>
            </template>
            <template #content> </template>
          </Card>
        </div>
        <div class="flex-1 tabs-container">
          <TabView>
            <TabPanel :header="$t('additional-information')">
              <div class="flex flex-column gap-5 m-2">
                <h4 class="h4 mb-0">
                  {{ $t("logs") }}
                </h4>
                <div class="flex flex-auto gap-5 flex-row">
                  <WMInput
                    name="created_by"
                    type="info"
                    :highlighted="true"
                    :label="$t('created_by') + ':'"
                    :value="customer.last_activity.creator.name"
                    width="150"
                  />
                  <WMInput
                    name="modified_by"
                    type="info"
                    :highlighted="true"
                    :label="$t('modified_by') + ':'"
                    :value="customer.last_activity.updater.name"
                    width="150"
                  />
                </div>
                <div class="flex flex-auto gap-5 flex-row">
                  <WMInput
                    name="created_at"
                    type="info"
                    :highlighted="true"
                    :label="$t('created_at') + ':'"
                    :value="customer.last_activity.creator.at"
                    width="150"
                  />
                  <WMInput
                    name="modified_at"
                    type="info"
                    :highlighted="true"
                    :label="$t('modified_at') + ':'"
                    :value="customer.last_activity.updater.at"
                    width="150"
                  />
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { useForm } from "vee-validate";
import { onMounted, provide, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

const { t } = useI18n();

const { can } = usePermissions();

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const { getTasksFromApi } = useTasks();
const { getServicesFromApi } = useServices();
const { checkIfEntityIsActive } = useLicensing();

const services = ref();
const tasks = ref();

const route = useRoute();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const utilsStore = useUtilsStore();
const toast = useToast();

const loaded = ref(false);

const customer = ref();
const types = ref();
const ratings = ref();
const selectedType = ref("");
const selectedRating = ref();
const selectedStatus = ref();
const selectedTerm = ref();
const statusConditionalStyle = ref("");

provide("preselectedCustomer", customer);

const {
  getContactColumns,
  getServiceColumns,
  getTaskColumns,
  getStatusConditionalStyle,
  getProjectDocumentColumns,
  getAssetColumnsforCustomerDetail,
  getCustomerPaymentsColumns,
} = useListUtils();

const contactColumns = ref(getContactColumns());
const serviceColumns = ref(getServiceColumns());
const documentsColumns = ref(getProjectDocumentColumns());
const taskColumns = ref(getTaskColumns());
const assetColumns = ref(getAssetColumnsforCustomerDetail());
const basicTerms = ref();

const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");
const isProvider = ref("");

const service_areas = ref();
const selectedServiceAreas = ref("");

utilsStore.resetElements();

onMounted(async () => {
  await fetchData();

  let params = {
    per_page: 99999,
    customer_id: route.params.id,
  };

  const selectedContacts = await getContactsFromApi(params);

  setSelectedContacts(selectedContacts.data);
});

const { setSelectedContacts, getContactsFromApi } = useContacts();

const { getCustomerFromApi, updateCustomer, parseCustomer } = useCustomers();

const fetchData = async () => {
  await optionSetsStore
    .getOptionSetValuesFromApi("service_area")
    .then((data) => (service_areas.value = data));

  await optionSetsStore
    .getOptionSetValuesFromApi("customer_type")
    .then((data) => (types.value = data));
  await optionSetsStore
    .getOptionSetValuesFromApi("customer_rating")
    .then((data) => (ratings.value = data));

  basicTerms.value = await optionSetsStore.getOptionSetValues("basic_term");

  await getCustomerFromApi(route.params.id).then((data) => {
    customer.value = data;

    utilsStore.selectedElements["customer"] = [customer.value];

    selectedServiceAreas.value = service_areas.value.filter((item) =>
      customer.value.service_areas.find((x) => x.id == item.id)
    );
    selectedRating.value = ratings.value.find((rating) => rating.id == customer.value.rating.id);

    selectedType.value = types.value.find((type) => type.id == customer.value.type.id);

    selectedTerm.value = basicTerms.value.find((term) => term.id == customer.value.basic_term?.id);

    selectedStatus.value = t("option-set.customer_status." + customer.value.status.value);

    statusConditionalStyle.value = getStatusConditionalStyle(customer.value.status.value);
    isProvider.value = yesNoOptions.find((option) => option.value == customer.value.is_provider);
  });

  loaded.value = true;

  const servicesData = await getServicesFromApi({
    customer_id: route.params.id,
  });
  services.value = servicesData.data;
  const tasksData = await getTasksFromApi({
    customer_id: route.params.id,
  });
  tasks.value = tasksData.data;
};

const { handleSubmit, setFieldError, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getCustomerDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  // if (customerNumberExists.value) {
  //   setFieldError("number", {
  //     key: "validation.exists",
  //     values: { label: "customer.customer" },
  //   });
  //   return;
  // }

  updateCustomer(route.params.id, parseCustomer(values))
    .then(() => {
      toast.successAction("customer", "updated");
      fetchData();
      resetForm({ values: values });
    })
    .catch((error) => {
      console.error(error);
      toast.error("customer", "not-updated");
    });
});

function onProviderChanged(value) {
  isProvider.value = value;
}

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "customer";
utilsStore.entity = "customer";

watch(
  () => meta.value,
  (value) => {
    if (value.touched) {
      formUtilsStore.formMeta = value;
      formUtilsStore.setFormMetas(value, props.formKey);
    }
  }
);

defineExpose({
  onSave,
  fetchData,
});
</script>

<style scoped lang="scss"></style>
