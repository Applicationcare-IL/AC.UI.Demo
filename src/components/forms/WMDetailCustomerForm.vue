<template>
  <div v-if="customer" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="customer-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('customer.customer') }}: {{ customer.name }}</h1>
      <div class=" flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('general-details') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput name="owner" type="info" :highlighted="true" :label="$t('owner') + ':'"
                           :value="customer.owner" />
                  <WMInput name="id" type="info" :highlighted="true" :label="$t('id') + ':'" :value="customer.number" />
                  <WMInput name="system-id" type="info" :highlighted="true" :label="$t('system-id') + ':'"
                           :value="customer.id" />
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput name="type" :highlighted="true" type="input-select" :label="$t('type') + ':'"
                             :options="typeOptions"
                             :selectedOption="typeOptions.find(type => type.value === customer.type)" />
                    <WMInput name="rating" :highlighted="true" type="input-select" :label="$t('type') + ':'"
                             :options="ratingOptions"
                             :selectedOption="ratingOptions.find(rating => rating.value === customer.rating)" />
                    <WMInput name="status" :highlighted="true" type="input-select" :label="$t('type') + ':'"
                             :options="statusOptions"
                             :selectedOption="statusOptions.find(status => status.value === customer.status)" />
                  </div>
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
                  <WMInput name="zip" type="input-text" :label="$t('address.zip') + ':'" width="80" />
                </div>

              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('customer.classification1') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <WMInputSearch name="classification-1" type="input-search" :options="classification1Options" width="252"
                               :placeholder="$t('select', ['classification-1'])" searchBy="label" multiple />
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class=" flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t('customer.notes') }} </template>
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
        <WMContactsTable :contacts="contacts" :columns="contactColumns" :rows="5">
        </WMContactsTable>
      </div>
      <div>
        <WMServicesTable :services="services" :columns="serviceColumns" :rows="5" multiselect>
        </WMServicesTable>
      </div>
      <div>
        <WMTasksTable :tasks="tasks" :columns="taskColumns" :rows="5" multiselect>
        </WMTasksTable>
      </div>
      <div class=" flex flex-row gap-5 flex-wrap mt-5">
        <div class="flex-1 card-container">
          <Card>
            <template #title>
              <div class="h1 mx-5 mt-5">קבצים מצורפים</div>
            </template>
            <template #content>

            </template>
          </Card>
        </div>
        <div class="flex-1 tabs-container">
          <TabView>
            <TabPanel header="נתונים נוספים">
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
            </TabPanel>
            <TabPanel header="טאב 1">
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem
                aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo.
                Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
                qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
              </p>
            </TabPanel>
            <TabPanel header="טאב 2">
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
                atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
                sunt in culpa qui
                officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
                expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                minus.
              </p>
            </TabPanel>
          </TabView>
        </div>
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
import { useOptionSetsStore } from '@/stores/optionSets';
import { useRoute } from 'vue-router'
import { CustomerService } from '@/service/CustomerService';
import { ServicesService } from '@/service/ServicesService';
import { TasksService } from '@/service/TasksService';
import { CitiesService } from '@/service/CitiesService';
import WMServicesTable from '@/components/tables/WMServicesTable.vue';
import WMContactsTable from '@/components/tables/WMContactsTable.vue';
import WMTasksTable from '@/components/tables/WMTasksTable.vue';

const customers = ref();
const services = ref();
const tasks = ref();
const cities = ref();

const formUtilsStore = useFormUtilsStore();
const OptionSetsStore = useOptionSetsStore();
const listUtilsStore = useListUtilsStore();
const customer = ref();
const contacts = ref();
const route = useRoute();
const typeOptions = OptionSetsStore.getOptionSetValues("type")
const ratingOptions = OptionSetsStore.getOptionSetValues("rating")
const statusOptions = OptionSetsStore.getOptionSetValues("status")
const alphabetWithDash = formUtilsStore.getAlphabetWithDash

const contactColumns = ref(listUtilsStore.getContactColumns);
const serviceColumns = ref(listUtilsStore.getServiceColumns);
const taskColumns = ref(listUtilsStore.getTaskColumns);

const classification1Options = OptionSetsStore.getOptionSetValues("classification1");

onMounted(() => {
  setTimeout(function () {
    CustomerService.getCustomer(route.params.id).then((data) => (customer.value = data));
  }, 1000);
  setTimeout(function () {
    ContactsService.getContactsMini().then((data) => (contacts.value = data));
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
