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
                    :label="$t('id') + ':'"
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
                    validationMessage="Validation Message"
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
                    :value="contact.notes"
                    type="text-area"
                    id="notes"
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
        <WMCustomersTable :contactId="contact.id" :columns="customerColumns">
        </WMCustomersTable>
      </div>
      <div>
        <WMServicesTable
          relatedEntity="contact"
          :relatedEntityId="contact.id"
          :columns="serviceColumns"
          multiselect
        >
        </WMServicesTable>
      </div>
      <div>
        <WMTasksTable
          relatedEntity="contact"
          :relatedEntityId="contact.id"
          :columns="taskColumns"
          multiselect
        />
      </div>
      <div>
        <WMProjectsTable
          relatedEntity="contact"
          :relatedEntityId="contact.id"
          multiselect
        />
      </div>
      <div class="flex-1 card-container">
        <Card>
          <template #title>
            <div class="h1 mx-5 mt-5">{{ $t("general-details") }}</div>
          </template>
          <template #content>
            <div class="flex flex-column gap-5 m-5">
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_by') + ':'"
                  :value="contact.created_by"
                  inline
                />
                <WMInput
                  name="modified_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_by') + ':'"
                  :value="contact.updated_by"
                  inline
                />
              </div>
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_at') + ':'"
                  :value="contact.created_at"
                  inline
                />
                <WMInput
                  name="modified_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_at') + ':'"
                  :value="contact.updated_at"
                  inline
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useForm } from "vee-validate";
import { useFormUtilsStore } from "@/stores/formUtils";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";
import { useRoute } from "vue-router";

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const { getTasksFromApi } = useTasks();
const { getServicesFromApi } = useServices();

const {
  getCustomerColumns,
  getServiceColumns,
  getTaskColumns,
  getStatusConditionalStyle,
} = useListUtils();

const customers = ref();
const services = ref();
const tasks = ref();
const cities = ref();

const formUtilsStore = useFormUtilsStore();

const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();
const contact = ref();
const route = useRoute();
const alphabet = formUtilsStore.getAlphabet;
const statuses = optionSetsStore.getOptionSetValues("status");
const genders = ref(optionSetsStore.optionSets["gender"]);

const loaded = ref(false);

const customerColumns = ref(getCustomerColumns());
const serviceColumns = ref(getServiceColumns());
const taskColumns = ref(getTaskColumns());

const toast = useToast();

const { getContactFromApi, updateContact, parseContact, setSelectedContacts } =
  useContacts();

onMounted(async () => {
  await fetchData();

  setSelectedContacts(contact.value);
});

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

const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getContactDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateContact(route.params.id, parseContact(values))
    .then((data) => {
      toast.successAction("contact", "updated");
      resetForm({ values: values });
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

watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);

defineExpose({
  onSave,
});

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};
</script>

<style scoped lang="scss"></style>
