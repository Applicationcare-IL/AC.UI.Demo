<template>
  <div
    v-if="service"
    class="wm-detail-form-container flex flex-auto pt-5 flex-column overflow-auto"
  >
    <div class="service-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container top-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="owner"
                    type="info"
                    :highlighted="true"
                    :label="$t('owner')"
                    :value="service.owner.name"
                  />
                  <WMInput
                    name="team"
                    type="info"
                    :highlighted="true"
                    :label="$t('team') + ':'"
                    :value="service.team"
                  />
                  <WMInput
                    name="priority"
                    type="info"
                    :highlighted="true"
                    :label="$t('service.priority')"
                    :value="service.priority"
                    :class="priorityClass(service)"
                    class="numeric"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row align-items-start gap-4">
                    <WMInput
                      name="contact"
                      type="info-link"
                      :highlighted="true"
                      :label="$t('contact.contact') + ':'"
                      :value="service.contact"
                      :to="'/contact/' + service.contact_id"
                    />
                    <WMInput
                      name="customer"
                      type="info-link"
                      :highlighted="true"
                      :label="$t('customer.customer') + ':'"
                      :value="service.customer"
                      :to="'/customer/' + service.customer_id"
                    />
                  </div>
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <!-- <WMInput
                      name="due-date"
                      type="info"
                      :highlighted="true"
                      :label="$t('service.due-date')"
                      :value="
                        useDateFormat(service.due_date, utilsStore.dateFormat)
                      "
                    />
                    <WMInput
                      name="open-date"
                      type="info"
                      :highlighted="true"
                      :label="$t('service.open-date')"
                      :value="
                        useDateFormat(service.open_date, utilsStore.dateFormat)
                      "
                    /> -->
                    <div class="wm-input flex flex-column">
                      <label class="wm-form-label highlighted"> SLA </label>
                      <WMSLATag
                        v-if="service.sla"
                        :sla="service.sla"
                        :days-for-closing="service.days_for_closing"
                        :state="service.state.value"
                      >
                      </WMSLATag>
                    </div>
                  </div>
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput
                      name="urgency"
                      type="info"
                      :highlighted="true"
                      :label="$t('service.urgency')"
                      :value="service.urgency[optionLabelWithLang]"
                    />
                    <WMInput
                      name="recurring"
                      type="info"
                      :highlighted="true"
                      :label="$t('service.recurring')"
                      :value="$t(service.recurring)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <WMDetailFormLocation :location="service.location" />
        <WMDetailFormSite :site="service.site" />
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title> {{ $t("service.description") }} </template>
            <template #content>
              <div class="contact-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    id="description"
                    type="text-area"
                    name="description"
                    :value="service.description"
                    disabled
                    width="full"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title>
              {{ $t("service.classification") }}
            </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="area"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-1') + ':'"
                    :value="service.area"
                    option-set
                  />
                  <WMInput
                    name="type"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-2') + ':'"
                    :value="service.type"
                    option-set
                  />
                  <WMInput
                    name="request1"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-3') + ':'"
                    :value="service.request1"
                    option-set
                  />
                </div>
                <div v-if="service.is_active" class="wm-form-row gap-5">
                  <!-- service.request2 {{ service.request2 }} -->
                  <WMInputSearch
                    v-model="service.request2"
                    name="request2"
                    :highlighted="true"
                    :label="$t('classification-4') + ':'"
                    :options="requests2"
                    option-set
                    @change="
                      updateDropdown(
                        'service_request_3',
                        $event.value.id,
                        'requests3'
                      )
                    "
                  />
                  <WMInputSearch
                    v-model="service.request3"
                    name="request3"
                    :highlighted="true"
                    :label="$t('classification-5') + ':'"
                    :options="requests3"
                    option-set
                  />
                </div>
                <div v-if="!service.is_active" class="wm-form-row gap-5">
                  <WMInput
                    name="request2"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-4') + ':'"
                    :value="service.request2?.value"
                    option-set
                  />
                  <WMInput
                    name="request3"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-5') + ':'"
                    :value="service.request3?.value"
                    option-set
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <WMDetailFormAsset v-if="service.asset" :asset="service.asset" />

      <div class="my-5">
        <WMStepper
          :steps="stages"
          :current-step="currentStage"
          aria-label="Form Steps"
        />
      </div>

      <Accordion v-if="can('tasks.read')">
        <AccordionTab :header="$t('task.tasks')">
          <WMTasksTable
            related-entity="service"
            :related-entity-id="service.id"
            :columns="taskColumns"
            multiselect
            @task-completed="fetchData"
          />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('journal')">
          <WMJournalDataView entity-type="service" :entity-id="service.id" />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('service.related-services')">
          <WMServicesTable
            related-entity="service"
            :related-entity-id="service.id"
            :columns="relatedServiceColumns"
            :hide-create-button="true"
            :hide-title="true"
            multiselect
            :show-link-service-button="true"
          />
        </AccordionTab>
      </Accordion>

      <Accordion :active-index="0">
        <AccordionTab :header="$t('documents.documents')">
          <WMDocumentsTable
            :columns="documentsColumns"
            :related-entity-id="route.params.id"
            related-entity="service"
            :hide-title="true"
          />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('attachments.attachments')">
          <WMAttachmentsTable
            :entity-id="route.params.id"
            entity-type="service"
          />
        </AccordionTab>
      </Accordion>

      <div class="my-2"></div>

      <div class="flex flex-row gap-5 flex-wrap mt-5">
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
                    :value="service.last_activity.creator.name"
                    width="150"
                  />
                  <WMInput
                    name="modified_by"
                    type="info"
                    :highlighted="true"
                    :label="$t('modified_by') + ':'"
                    :value="service.last_activity.updater.name"
                    width="150"
                  />
                </div>
                <div class="flex flex-auto gap-5 flex-row">
                  <WMInput
                    name="created_at"
                    type="info"
                    :highlighted="true"
                    :label="$t('created_at') + ':'"
                    :value="service.last_activity.creator.at"
                    width="150"
                  />
                  <WMInput
                    name="modified_at"
                    type="info"
                    :highlighted="true"
                    :label="$t('modified_at') + ':'"
                    :value="service.last_activity.updater.at"
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
// IMPORTS
import { useDateFormat } from "@vueuse/core";
import { useForm } from "vee-validate";
import { onMounted, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { optionLabelWithLang } = useLanguages();
const { getServiceDocumentsColumns, getRelatedServiceColumns } = useListUtils();
const { can } = usePermissions();

const { getTasksFromApi } = useTasks();
const { setSelectedContacts, getContactFromApi } = useContacts();
const { getCustomerFromApi } = useCustomers();

const {
  updateService,
  parseUpdateService,
  getServiceFromApi,
  cancelService,
  mapContactsFromServices,
} = useServices();

const toast = useToast();
const route = useRoute();

const { getTaskColumns, getPriorityClasses } = useListUtils();

const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

// REFS
const documentsColumns = ref(getServiceDocumentsColumns());
const relatedServiceColumns = ref(getRelatedServiceColumns());

const stages = ref([]);
const currentStage = ref();
const tasks = ref();
const service = ref();

const contact = ref();
const customer = ref();

const taskColumns = ref(getTaskColumns());

const requests2 = ref([]);
const requests3 = ref([]);
const optionRefs = {
  requests2: requests2,
  requests3: requests3,
};

// COMPUTED

// COMPONENT METHODS AND LOGIC

const fetchData = async () => {
  const data = await getServiceFromApi(route.params.id);
  service.value = data;

  setContact(data.contact_id);
  setCustomer(data.customer_id);

  stages.value = data.stages.map((stage) => ({
    label: stage.name,
    date: stage.sla.due_date
      ? useDateFormat(stage.sla.due_date, "DD/MM/YY")
      : null,
  }));

  updateDropdown("service_request_2", data.request1?.id, "requests2");

  currentStage.value = data.current_stage?.order;
  utilsStore.selectedElements["service"] = [service.value];

  const tasksData = await getTasksFromApi({
    entity_type: "service",
    entity_id: route.params.id,
  });
  tasks.value = tasksData.data;
};

/**
 * We use this function to get the full data of the contact, that we use for example
 * to provide it to child contacts forms (like the new task form)
 * @param {number} contactId
 */
const setContact = (contactId) => {
  getContactFromApi(contactId).then((data) => {
    contact.value = data;
  });
};

/**
 * We use this function to get the full data of the customer, that we use for example
 * to provide it to child customers forms (like the new task form)
 * @param {number} customerId
 */
const setCustomer = (customerId) => {
  getCustomerFromApi(customerId).then((data) => {
    customer.value = data;
  });
};

const updateDropdown = (optionSet, selectedValue, dropdownOptions) => {
  optionSetsStore
    .getOptionSetValuesFromApiRaw(optionSet, selectedValue)
    .then((data) => {
      optionRefs[dropdownOptions].value = data;
    });
};

const { handleSubmit, meta } = useForm({
  validationSchema: formUtilsStore.getServiceDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateService(route.params.id, parseUpdateService(values))
    .then(() => {
      toast.successAction("service", "updated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("service", "not-updated");
    });
});

const priorityClass = (data) => {
  return getPriorityClasses(data);
};

// formUtilsStore.submit = onSubmit;
formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "service";
utilsStore.entity = "service";

const handleCancelService = (id) => {
  cancelService(id, formUtilsStore.cancelServiceReasons)
    .then(() => {
      toast.successAction("service", "canceled");
    })
    .catch((error) => {
      console.error(error);
      toast.error("service", "not-canceled");
    });
};

formUtilsStore.cancelService = handleCancelService;

// PROVIDE, EXPOSE
provide("preselectedContact", contact);
provide("preselectedCustomer", customer);

defineExpose({
  onSave,
  fetchData,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (value.touched) {
      formUtilsStore.formMeta = value;
      formUtilsStore.setFormMetas(value, props.formKey);
    }
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await fetchData();
  setSelectedContacts(mapContactsFromServices(service.value));
});
</script>

<style scoped lang="scss"></style>
