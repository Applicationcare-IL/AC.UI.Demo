<template>
  <div v-if="contact" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="contact-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('contact.contact') }}: {{ contact.name }}</h1>
      <div class=" flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('general-details') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput name="owner" type="info" :highlighted="true" :label="$t('in-charge') + ':'"
                           :value="contact.in_charge" />
                  <WMInput name="id" type="info" :highlighted="true" :label="$t('id') + ':'"
                           :value="contact.contact_id" />
                  <WMInput name="system-id" type="info" :highlighted="true" :label="$t('system-id') + ':'"
                           :value="contact.id" />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput name="first-name" :required="true" type="input-text" :label="$t('first-name') + ':'"
                           :value="contact.firstName" />
                  <WMInput name="last-name" :required="true" validationMessage="Validation Message" type="input-text"
                           :label="$t('last-name') + ':'" :value="contact.lastName" />
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput name="status" :highlighted="true" type="input-select" :label="$t('status') + ':'"
                             :options="statuses"
                             :selectedOption="statuses.find(status => status.value === contact.status)" />

                    <WMInput name="gender" :highlighted="true" type="input-select" :label="$t('gender') + ':'"
                             :options="genders" :selectedOption="genders.find(gender => gender.value === contact.gender)"
                             :placeholder="$t('select', ['gender'])" width="130" />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('communication-details') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-5">
                    <WMInput name="mobile-phone" :required="true" type="input-text" :label="$t('mobilephone') + ':'"
                             width="88" :value="contact.telephone" />
                    <WMInput name="landline" type="input-text" :label="$t('landline') + ':'" width="88"
                             :value="contact.landline" />
                    <WMInput name="fax" type="input-text" :label="$t('fax') + ':'" width="88" />
                  </div>
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput name="facebook" type="input-text" :label="$t('facebook') + ':'" width="88" />
                  <WMInput name="email" :required="true" type="input-text" :label="$t('email') + ':'" width="240"
                           :value="contact.email" />

                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('address.address') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInputSearch name="city" :highlighted="true" :label="$t('address.city') + ':'" :options="cities"
                                 width="152" :placeholder="$t('select', ['address.city'])" />
                  <WMInputSearch name="street" :highlighted="true" :label="$t('address.street') + ':'"
                                 :options="customers" width="152" :placeholder="$t('select', ['address.street'])" />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput name="house-number" type="input-text" :label="$t('address.house-number') + ':'" width="48" />
                  <WMInput name="apartment" type="input-text" :label="$t('address.apartment') + ':'" width="48" />
                  <WMInput name="entrance" type="input-select" :highlighted="true" :label="$t('address.entrance') + ':'"
                           :options="alphabetWithDash" width="48" />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput name="zip" type="input-text" :label="$t('address.zip') + ':'" width="80" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class=" flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t('contact.notes') }} </template>
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
            <template #title> {{ $t('service.open') }} : 4 </template>

            <template #content>
              <div class="flex flex-column gap-3">
                <div
                     class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-teal-200 text-teal-900">
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">4</span>
                </div>
                <div
                     class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-gray-100 text-gray-900">
                  <span class="font-size-20 font-weight-light">Breach</span>
                  <span class="font-size-24 font-weight-bold">0</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class=" card-container flex-1 middle-info-card">
          <Card>
            <template #title> {{ $t('task.open') }} : 14</template>
            <template #content>
              <div class="flex flex-column gap-3">
                <div
                     class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-teal-200 text-teal-900">
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">10</span>
                </div>
                <div
                     class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-red-50 text-red-600">
                  <span class="font-size-20 font-weight-light">Breach</span>
                  <span class="font-size-24 font-weight-bold">4</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div>
        <WMCustomersTable :customers="customers" :columns="customerColumns" :rows="5">
        </WMCustomersTable>
      </div>
      <div>
        <WMServicesTable :services="services" :columns="serviceColumns" :rows="5" multiselect>
        </WMServicesTable>
      </div>
      <div>
        <WMTasksTable :tasks="tasks" :columns="taskColumns" :rows="5" multiselect>
        </WMTasksTable>
      </div>
      <div class="flex-1 card-container">
        <Card>
          <template #title>
            <div class="h1 mx-5 mt-5">{{ $t('general-details') }}</div>
          </template>
          <template #content>
            <div class="flex flex-column gap-5 m-5">
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput name="created_by" type="info" :highlighted="true" :label="$t('created_by') + ':'"
                         value="Israel Israeli" inline />
                <WMInput name="modified_by" type="info" :highlighted="true" :label="$t('modified_by') + ':'"
                         value="שרוליק כהן" inline />
              </div>
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput name="created_at" type="info" :highlighted="true" :label="$t('created_at') + ':'"
                         value="12:38  11/11/22" inline />
                <WMInput name="modified_at" type="info" :highlighted="true" :label="$t('modified_at') + ':'"
                         value="12:38  11/11/22" inline />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ContactsService } from '@/service/ContactsService';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import WMInput from '@/components/forms/WMInput.vue';
import { useForm } from 'vee-validate';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useListUtilsStore } from '@/stores/listUtils';
import { useOptionSetsStore } from '@/stores/OptionSets';
import { useRoute } from 'vue-router'
import { CustomerService } from '@/service/CustomerService';
import { ServicesService } from '@/service/ServicesService';
import { TasksService } from '@/service/TasksService';
import { CitiesService } from '@/service/CitiesService';
import WMServicesTable from '@/components/tables/WMServicesTable.vue';
import WMCustomersTable from '@/components/tables/WMCustomersTable.vue';
import WMTasksTable from '@/components/tables/WMTasksTable.vue';

const customers = ref();
const services = ref();
const tasks = ref();
const cities = ref();

const formUtilsStore = useFormUtilsStore();
const listUtilsStore = useListUtilsStore();
const optionSetsStore = useOptionSetsStore();
const genders = optionSetsStore.getOptionSetValues("gender");
const contact = ref();
const route = useRoute();
const alphabetWithDash = formUtilsStore.getAlphabetWithDash
const statuses = optionSetsStore.getOptionSetValues("status")

const customerColumns = ref(listUtilsStore.getCustomerColumns);
const serviceColumns = ref(listUtilsStore.getServiceColumns);
const taskColumns = ref(listUtilsStore.getTaskColumns);

onMounted(() => {
  setTimeout(function () {
    ContactsService.getContact(route.params.id).then((data) => (contact.value = data));
  }, 1000);
  setTimeout(function () {
    CustomerService.getCustomersMini().then((data) => (customers.value = data));
  }, 2000);
  setTimeout(function () {
    ServicesService.getServicesMini().then((data) => (services.value = data));
  }, 2000);
  setTimeout(function () {
    TasksService.getTasksMini().then((data) => (tasks.value = data));
  }, 2000);
  setTimeout(function () {
    CitiesService.getCities().then((data) => (cities.value = data));
  }, 2000);
});

const { errors, handleSubmit, setFieldError } = useForm({
  validationSchema: formUtilsStore.getContactDetailFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  setFieldError('mobile-phone', 'Customer already exists');
  console.log(values);
});

formUtilsStore.submit = onSubmit;
formUtilsStore.formErrors = errors;

</script>

<style scoped lang="scss"></style>
