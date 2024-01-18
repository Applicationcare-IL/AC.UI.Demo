<template>
  <div
    v-if="loaded"
    class="wm-detail-form-container flex flex-auto flex-column overflow-auto"
  >
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row align-items-center gap-4">
        <h1 class="h1 mb-0">{{ $t("contact.contact") }}: {{ contact.name }}</h1>
        <div :class="statusClass(contact.status)" class="status-label">
          {{ $t("statuses." + contact.status) }}
        </div>
      </div>
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
                      :value="
                        genders.find(
                          (gender) => gender.id === contact.gender?.id
                        )
                      "
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
        <div class="flex-1 card-container top-info-card">
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
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title>
              {{ $t("service.open") }} : {{ contact.open_services }}
            </template>

            <template #content>
              <div class="flex flex-column gap-3">
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-teal-200 text-teal-900"
                  :class="
                    contact.open_services - contact.breached_services > 0
                      ? 'bg-teal-200 text-teal-900'
                      : 'bg-gray-100 text-gray-900'
                  "
                >
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    contact.open_services - contact.breached_services
                  }}</span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-gray-100 text-gray-900"
                  :class="
                    contact.breached_services > 0
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-900'
                  "
                >
                  <span class="font-size-20 font-weight-light">Breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    contact.breached_services
                  }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title>
              {{ $t("task.open") }} : {{ contact.open_tasks }}</template
            >
            <template #content>
              <div class="flex flex-column gap-3">
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm"
                  :class="
                    contact.open_tasks - contact.breached_tasks > 0
                      ? 'bg-teal-200 text-teal-900'
                      : 'bg-gray-100 text-gray-900'
                  "
                >
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    contact.open_tasks - contact.breached_tasks
                  }}</span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm"
                  :class="
                    contact.breached_tasks > 0
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-900'
                  "
                >
                  <span class="font-size-20 font-weight-light">Breach</span>
                  <span class="font-size-24 font-weight-bold"
                    >{{ contact.breached_tasks }}
                  </span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div>
        <WMCustomersTable :contact-id="contact.id" :columns="customerColumns" />
      </div>
      <div>
        <WMServicesTable
          v-if="checkIfEntityIsActive('services')"
          related-entity="contact"
          :related-entity-id="contact.id"
          :columns="serviceColumns"
          multiselect
        />
      </div>
      <div>
        <WMTasksTable
          related-entity="contact"
          :related-entity-id="contact.id"
          :columns="taskColumns"
          multiselect
        />
      </div>
      <div>
        <WMProjectsTable
          related-entity="contact"
          :related-entity-id="contact.id"
          :multiselect="false"
          :show-header-options="false"
        />
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

const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();
const route = useRoute();
const toast = useToast();

const {
  getCustomerColumns,
  getServiceColumns,
  getTaskColumns,
  getStatusConditionalStyle,
} = useListUtils();

const { getContactFromApi, updateContact, parseContact, setSelectedContacts } =
  useContacts();

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

const genders = ref(optionSetsStore.optionSets["gender"]);
const loaded = ref(false);

const customerColumns = ref(getCustomerColumns());
const serviceColumns = ref(getServiceColumns());
const taskColumns = ref(getTaskColumns());

// COMPUTED

// COMPONENT METHODS
const fetchData = async () => {
  getContactFromApi(route.params.id).then((data) => {
    contact.value = data;
    utilsStore.selectedElements["contact"] = [contact.value];
    loaded.value = true;
  });
  // const servicesData = await getServicesFromApi({
  //   customer_id: route.params.id,
  // });
  // services.value = servicesData.data;
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

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "contact";
utilsStore.entity = "contact";

// PROVIDE, EXPOSE
provide("preselectedContact", contact);

defineExpose({
  onSave,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await fetchData();

  setSelectedContacts(contact.value);
});
</script>

<style scoped lang="scss"></style>
