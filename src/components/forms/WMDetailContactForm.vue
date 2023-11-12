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
                      name="contactid"
                      :highlighted="true"
                      type="input-text"
                      :label="$t('contact.identifier') + ':'"
                    />

                    <WMInput
                      name="gender"
                      :highlighted="true"
                      type="input-select"
                      :label="$t('gender') + ':'"
                      :options="genders"
                      :selectedOption="
                        genders.find(
                          (gender) => gender.value === contact.gender
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
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("address.address") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInputSearch
                    name="city"
                    :highlighted="true"
                    :label="$t('address.city') + ':'"
                    :options="cities"
                    width="152"
                    :placeholder="$t('select', ['address.city'])"
                    :modelValue="contact.city"
                  />
                  <WMInputSearch
                    name="street"
                    :highlighted="true"
                    :label="$t('address.street') + ':'"
                    :options="customers"
                    width="152"
                    :placeholder="$t('select', ['address.street'])"
                    :modelValue="contact.street"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="house-number"
                    type="input-text"
                    :label="$t('address.house-number') + ':'"
                    width="48"
                    :value="contact.street_number"
                  />
                  <WMInput
                    name="apartment"
                    type="input-text"
                    :label="$t('address.apartment') + ':'"
                    width="48"
                  />
                  <WMInput
                    name="entrance"
                    type="input-select"
                    :highlighted="true"
                    :label="$t('address.entrance') + ':'"
                    :options="alphabetWithDash"
                    width="48"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="zip"
                    type="input-text"
                    :label="$t('address.zip') + ':'"
                    width="80"
                    :value="contact.zipcode"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t("contact.notes") }} </template>
            <template #content>
              <div class="contact-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <Textarea v-model="value" autoResize rows="5" />
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
                >
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    contact.open_services - contact.breached_services
                  }}</span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-gray-100 text-gray-900"
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
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-teal-200 text-teal-900"
                >
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    contact.open_tasks - contact.breached_tasks
                  }}</span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-red-50 text-red-600"
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
        <WMCustomersTable
          :contact="contact"
          :columns="customerColumns"
          :rows="5"
        >
        </WMCustomersTable>
      </div>
      <div>
        <WMServicesTable
          :services="services"
          :columns="serviceColumns"
          multiselect
        >
        </WMServicesTable>
      </div>
      <div>
        <WMTasksTable :tasks="tasks" :columns="taskColumns" multiselect>
        </WMTasksTable>
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
                  value="Israel Israeli"
                  inline
                />
                <WMInput
                  name="modified_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_by') + ':'"
                  value="שרוליק כהן"
                  inline
                />
              </div>
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_at') + ':'"
                  value="12:38  11/11/22"
                  inline
                />
                <WMInput
                  name="modified_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_at') + ':'"
                  value="12:38  11/11/22"
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
import { useListUtilsStore } from "@/stores/listUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";
import { useRoute } from "vue-router";
import { ContactsService } from "@/service/ContactsService";
import { CustomerService } from "@/service/CustomerService";
import { ServicesService } from "@/service/ServicesService";
import { TasksService } from "@/service/TasksService";

import { useToast } from "@/stores/toast";

const customers = ref();
const services = ref();
const tasks = ref();
const cities = ref();

const formUtilsStore = useFormUtilsStore();
const listUtilsStore = useListUtilsStore();
const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();
const genders = optionSetsStore.getOptionSetValues("gender");
const contact = ref();
const route = useRoute();
const alphabetWithDash = formUtilsStore.getAlphabetWithDash;
const statuses = optionSetsStore.getOptionSetValues("status");

const loaded = ref(false);

const customerColumns = ref(listUtilsStore.getCustomerColumns);
const serviceColumns = ref(listUtilsStore.getServiceColumns);
const taskColumns = ref(listUtilsStore.getTaskColumns);

const toast = useToast();

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  ContactsService.getContactFromApi(route.params.id).then((data) => {
    contact.value = data;
    utilsStore.selectedElements["contact"] = [contact.value];
    console.log(contact.value);
    loaded.value = true;
  });
  const servicesData = await ServicesService.getServicesFromApi({
    customer_id: route.params.id,
  });
  services.value = servicesData.data;
  const tasksData = await TasksService.getTasksFromApi({
    customer_id: route.params.id,
  });
  tasks.value = tasksData.tasks;
};

const { errors, handleSubmit, setFieldError, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getContactDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  ContactsService.updateContact(
    route.params.id,
    ContactsService.parseContact(values)
  )
    .then((data) => {
      toast.successAction("contact", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.log(error);
      toast.error("customer", "not-updated");
    });
  ContactsService.updateContact(
    route.params.id,
    ContactsService.parseContact(values)
  )
    .then((data) => {
      toast.successAction("contact", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.log(error);
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
  }
);

const statusClass = (data) => {
  return listUtilsStore.getStatusConditionalStyle(data);
};
</script>

<style scoped lang="scss"></style>
