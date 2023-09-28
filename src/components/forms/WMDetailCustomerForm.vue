<template>
  <div v-if="loaded" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
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
                  <WMInput name="system_id" type="info" :highlighted="true" :label="$t('customer.system-id') + ':'"
                           :value="customer.id" />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput name="name" type="input-text" :highlighted="true" :label="$t('id') + ':'"
                           :value="customer.name" width="150" required />
                  <WMInput name="number" type="input-text" :highlighted="true" :label="$t('id') + ':'"
                           @input.stop="onCustomerNumberChanged" :value="customer.number" width="150" required />

                </div>
                <div class="wm-form-row gap-5">

                  <WMInput name="type" :highlighted="true" type="input-select" :label="$t('type') + ':'" :options="types"
                            width="80" :value="selectedType" />
                  <WMInput name="rating" :highlighted="true" type="input-select" :label="$t('rating') + ':'"
                           :options="ratings" :value="selectedRating" width="80" />
                  <WMInput name="is_provider" type="input-select-button" :highlighted="true"
                           :label="$t('customer.is-provider') + ':'" :options="yesNoOptions"
                           :value="isProvider" width="80" />
                  <WMInput name="status" type="info" :highlighted="true" :label="$t('status') + ':'"
                           :class="statusConditionalStyle" :value="$t(selectedStatus)" width="72" />
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
                                 width="152" :placeholder="$t('select', ['address.city'])" :selectedOption="selectedCity"
                                 :modelValue="selectedCity" />
                  <WMInputSearch name="street" :highlighted="true" :label="$t('address.street') + ':'" :options="cities"
                                 width="152" :placeholder="$t('select', ['address.street'])"
                                 :selectedOption="selectedStreet" :modelValue="selectedStreet" />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput name="house-number" type="input-text" :label="$t('address.house-number') + ':'" width="48"
                           :value="customer.street_number" />
                  <WMInput name="apartment" type="input-text" :label="$t('address.apartment') + ':'" width="48" />
                  <WMInput name="entrance" type="input-select" :highlighted="true" :label="$t('address.entrance') + ':'"
                           :options="alphabetWithDash" width="48"
                           :value="selectedEntrance" />
                  <WMInput name="zip" type="input-text" :label="$t('address.zip') + ':'" width="80"
                           :value="customer.zipcode" />
                </div>

              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t('customer.areas') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <WMInputSearch name="service_area" type="input-search" :placeholder="$t('select', ['customer.area'])"
                               :required="true" :multiple="true" width="248" :options="service_areas" :highlighted="true"
                               :modelValue="selectedServiceAreas" />
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
                  <Textarea name="notes" v-model="value" autoResize rows="5" />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title> {{ $t('service.open') }} : {{ customer.open_services }} </template>

            <template #content>
              <div class="flex flex-column gap-3">
                <div
                     class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-teal-200 text-teal-900">
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">{{ customer.open_services - customer.breached_services
                  }}</span>
                </div>
                <div
                     class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-gray-100 text-gray-900">
                  <span class="font-size-20 font-weight-light">Breach</span>
                  <span class="font-size-24 font-weight-bold">{{ customer.breached_services }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class=" card-container flex-1 middle-info-card">
          <Card>
            <template #title> {{ $t('task.open') }} : {{ customer.open_tasks }}</template>
            <template #content>
              <div class="flex flex-column gap-3">
                <div
                     class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-teal-200 text-teal-900">
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">{{ customer.open_tasks - customer.breached_tasks }}</span>
                </div>
                <div
                     class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-red-50 text-red-600">
                  <span class="font-size-20 font-weight-light">Breach</span>
                  <span class="font-size-24 font-weight-bold">{{ customer.breached_tasks }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div>
        <WMContactsTable :columns="contactColumns" :rows="5" :customer="customer">
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
import { ref, onMounted, watch } from 'vue';
import { ContactsService } from '@/service/ContactsService';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import WMInput from '@/components/forms/WMInput.vue';
import { useForm } from 'vee-validate';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useListUtilsStore } from '@/stores/listUtils';
import { useUtilsStore } from '@/stores/utils';
import { useOptionSetsStore } from '@/stores/optionSets';
import { useRoute } from 'vue-router'
import { CustomerService } from '@/service/CustomerService';
import { ServicesService } from '@/service/ServicesService';
import { TasksService } from '@/service/TasksService';
import { CitiesService } from '@/service/CitiesService';
import WMServicesTable from '@/components/tables/WMServicesTable.vue';
import WMContactsTable from '@/components/tables/WMContactsTable.vue';
import WMTasksTable from '@/components/tables/WMTasksTable.vue';
import { i18n } from '@/i18n';
import { useToast } from '@/stores/toast';

const services = ref();
const tasks = ref();
const cities = ref();

const route = useRoute();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();
const listUtilsStore = useListUtilsStore();
const utilsStore = useUtilsStore();
const toast = useToast();

const loaded = ref(false);

const customer = ref();
const types = ref();
const ratings = ref();
const selectedType = ref('');
const selectedRating = ref();
const selectedStatus = ref();
const selectedEntrance = ref('');
const statusConditionalStyle = ref('');

const alphabetWithDash = formUtilsStore.getAlphabetWithDash

const contactColumns = ref(listUtilsStore.getContactColumns);
const serviceColumns = ref(listUtilsStore.getServiceColumns);
const taskColumns = ref(listUtilsStore.getTaskColumns);

const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo")
const isProvider = ref('');

const service_areas = ref();
const selectedServiceAreas = ref('');

const selectedCity = ref('');
const selectedStreet = ref('');

utilsStore.resetElements();

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  await optionSetsStore.getOptionSetValuesFromApi('service_area').then((data) => service_areas.value = data);

  await optionSetsStore.getOptionSetValuesFromApi('customer_type').then((data) => types.value = data);
  await optionSetsStore.getOptionSetValuesFromApi('customer_rating').then((data) => ratings.value = data);
  await CitiesService.getCities().then((data) => cities.value = data);
  await CustomerService.getCustomerFromApi(route.params.id).then((data) => {
    customer.value = data
    utilsStore.selectedElements['customer'] = [customer.value];

    selectedServiceAreas.value = service_areas.value.filter((item) => customer.value.service_areas.find(x => x.id == item.id));
    selectedRating.value = ratings.value.find(rating => rating.id == customer.value.rating.id)
    selectedCity.value = customer.value.city != null ? cities.value.find(city => city.name == customer.value.city) : '';
    selectedStreet.value = customer.value.street != null ? cities.value.find(street => street.name == customer.value.street) : '';

    selectedType.value = types.value.find(type => type.id == customer.value.type.id)
    selectedStatus.value = i18n.t('option-set.customer_status.' + customer.value.status.value);

    statusConditionalStyle.value = utilsStore.getStatusConditionalStyle(customer.value.status.value);
    isProvider.value = yesNoOptions.find(option => option.value == customer.value.is_provider);
  });
  loaded.value = true;
  ServicesService.getServicesMini().then((data) => (services.value = data));
  TasksService.getTasksMini().then((data) => (tasks.value = data));
}

const { errors, handleSubmit, setFieldError, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getCustomerDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  if(customerNumberExists.value) {
    setFieldError('number', { key: 'validation.exists', values: { label: 'customer.customer' } })
    return
  }
  CustomerService.updateCustomer(route.params.id, CustomerService.parseCustomer(values)).then((data) => {
    toast.successAction('customer', 'updated');
    resetForm(({ values: values }));
  }).catch((error) => {
    console.log(error);
    toast.error('customer', 'not-updated');
  });
});

const customerNumberExists = ref(false);
const onCustomerNumberChanged = (event) => {
  utilsStore.debounceAction(() => {
    CustomerService.existsCustomer("id", event.target.value)
      .then((exists) => (
        customerNumberExists.value = exists,
        exists ?
          setFieldError('number', { key: 'validation.exists', values: { label: 'customer.customer' } })
          : setFieldError('number', undefined)))
  });
};

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "customer";
utilsStore.entity= "customer";

watch(() => meta.value, (value) => {
  formUtilsStore.formMeta = value;
});

</script>

<style scoped lang="scss"></style>
