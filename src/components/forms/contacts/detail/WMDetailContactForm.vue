<template>
  <div v-if="loaded" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">
          <Card class="p-card--first-top-card">
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="owner"
                    type="info"
                    :highlighted="true"
                    :label="$t('owner') + ':'"
                    :value="contact.owner.name"
                  />
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('contact.system-id') + ':'"
                    :value="contact.id"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="first-name"
                    :required="true"
                    type="input-text"
                    :label="$t('first-name') + ':'"
                    :value="contact.firstName"
                  />
                  <WMInput
                    name="last-name"
                    :required="true"
                    validation-message="Validation Message"
                    type="input-text"
                    :label="$t('last-name') + ':'"
                    :value="contact.lastName"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput
                      name="contact-number"
                      :highlighted="true"
                      type="input-text"
                      :value="contact['contact-number']"
                      :label="$t('contact.number') + ':'"
                    />

                    <WMInput
                      name="gender"
                      :highlighted="true"
                      type="input-select"
                      :label="$t('gender') + ':'"
                      :options="genders"
                      :value="genderSelected"
                      :placeholder="$t('select', ['gender'])"
                      width="130"
                      option-set
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <WMDetailFormLocation :location="contact.location" editable />
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t("contact.notes") }} </template>
            <template #content>
              <div class="contact-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    id="notes"
                    :value="contact.notes"
                    type="text-area"
                    name="notes"
                    size="full"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container middle-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t("communication-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-5">
                    <WMInput
                      name="mobile-phone"
                      :required="true"
                      type="input-text"
                      :label="$t('mobilephone') + ':'"
                      width="88"
                      :value="contact.telephone"
                    />
                    <WMInput
                      name="landline"
                      type="input-text"
                      :label="$t('landline') + ':'"
                      width="88"
                      :value="contact.landline"
                    />
                    <WMInput
                      name="fax"
                      type="input-text"
                      :label="$t('fax') + ':'"
                      width="88"
                      :value="contact.fax"
                    />
                  </div>
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="email"
                    :required="true"
                    type="input-text"
                    :label="$t('email') + ':'"
                    :value="contact.email"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title> {{ $t("service.open") }} : {{ contact.open_services }} </template>

            <template #content>
              <div class="flex flex-column gap-3 font-bold">
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-green-200 text-green-900"
                >
                  <span class="font-size-20">{{ $t("sla.no_breach") }}</span>
                  <span class="font-size-24">
                    {{ contact.open_services - contact.breached_services }}
                  </span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-gray-100 text-gray-900"
                >
                  <span class="font-size-20">{{ $t("sla.breached") }}</span>
                  <span class="font-size-24">{{ contact.breached_services }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title> {{ $t("task.open") }} : {{ contact.open_tasks }}</template>
            <template #content>
              <div class="flex flex-column gap-3 font-bold">
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-green-200 text-green-900"
                >
                  <span class="font-size-20">{{ $t("sla.no_breach") }}</span>
                  <span class="font-size-24">{{
                    contact.open_tasks - contact.breached_tasks
                  }}</span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-red-100 text-red-700"
                >
                  <span class="font-size-20">{{ $t("sla.breached") }}</span>
                  <span class="font-size-24">
                    {{ contact.breached_tasks }}
                  </span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div>
        <Accordion v-if="can('customers.read')" data-testid="customers-accordion">
          <AccordionTab :header="$t('customer.customer')">
            <WMCustomersTableSection
              v-if="can('customers.read')"
              :related-entity-id="contact.id"
              related-entity="contact"
              :columns="customerColumns"
              :hide-title="true"
            />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <Accordion
          v-if="checkIfEntityIsActive('services') && can('services.read')"
          data-testid="services-accordion"
        >
          <AccordionTab :header="$t('service.service')">
            <WMServicesTable
              v-if="checkIfEntityIsActive('services') && can('services.read')"
              related-entity="contact"
              :related-entity-id="contact.id"
              :columns="serviceColumns"
              multiselect
              :hide-title="true"
            />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <Accordion v-if="can('tasks.read')" data-testid="tasks-accordion">
          <AccordionTab :header="$t('task.tasks')">
            <WMTasksTable
              v-if="can('tasks.read')"
              related-entity="contact"
              :related-entity-id="contact.id"
              :columns="taskColumns"
              multiselect
              :hide-title="true"
            />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <Accordion v-if="can('projects.read')" data-testid="projects-accordion">
          <AccordionTab :header="$t('project.projects')">
            <WMProjectsTable
              v-if="can('projects.read') && checkIfEntityIsActive('projects')"
              related-entity="contact"
              :related-entity-id="contact.id"
              :multiselect="false"
              :show-header-options="false"
              :hide-title="true"
            />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <Accordion data-testid="documents-accordion">
          <AccordionTab :header="'Documents'">
            <WMDocumentsTable
              :columns="documentsColumns"
              :related-entity-id="contact.id"
              related-entity="contact"
              :show-header-options="true"
              :hide-title="true"
            />
          </AccordionTab>
        </Accordion>
      </div>
      <div class="flex-1 tabs-container mt-5 pt-5">
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
                  :value="contact.last_activity.creator.name"
                  width="150"
                />
                <WMInput
                  name="modified_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_by') + ':'"
                  :value="contact.last_activity.updater.name"
                  width="150"
                />
              </div>
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_at') + ':'"
                  :value="contact.last_activity.creator.at"
                  width="150"
                />
                <WMInput
                  name="modified_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_at') + ':'"
                  :value="contact.last_activity.updater.at"
                  width="150"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getTasksFromApi } = useTasks();
const { checkIfEntityIsActive } = useLicensing();
const { can } = usePermissions();

const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();
const route = useRoute();
const toast = useToast();

const { getCustomerColumns, getServiceColumns, getTaskColumns, getProjectDocumentColumns } =
  useListUtils();

const { getContactFromApi, updateContact, parseContact, setSelectedContacts } = useContacts();

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

// REFS
const contact = ref();
const tasks = ref();

const genders = ref();
const genderSelected = ref();
const loaded = ref(false);

const customerColumns = ref(getCustomerColumns());
const serviceColumns = ref(getServiceColumns());
const taskColumns = ref(getTaskColumns());
const documentsColumns = ref(getProjectDocumentColumns());

const firstRelatedCustomer = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const fetchData = async () => {
  getContactFromApi(route.params.id).then((data) => {
    contact.value = data;
    utilsStore.selectedElements["contact"] = [contact.value];
    setSelectedContacts(contact.value);

    if (data.customers.length > 0) {
      firstRelatedCustomer.value = data.customers[0];
    }

    loaded.value = true;
  });

  const tasksData = await getTasksFromApi({
    customer_id: route.params.id,
  });
  tasks.value = tasksData?.data;
};

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getContactDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateContact(route.params.id, parseContact(values))
    .then(() => {
      toast.successAction("contact", "updated");
      resetForm({ values: values });
      fetchData();
    })
    .catch((error) => {
      console.error(error);
      toast.error("customer", "not-updated");
    });
});

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "contact";
utilsStore.entity = "contact";

// PROVIDE, EXPOSE
provide("preselectedContact", contact);
provide("preselectedCustomer", firstRelatedCustomer);

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

  setSelectedContacts(contact.value);

  genders.value = await optionSetsStore.getOptionSetValues("gender");

  genderSelected.value = genders.value.find((gender) => gender.id === contact.value.gender?.id);
});
</script>

<style scoped lang="scss"></style>
